import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { IAccount } from '../interfaces/iaccount';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    baseUrl = environment.baseUrl;
    appVersion = environment.appVersion;

    exportCSV(data: any[], fileName: string): void {
        const csvData = Papa.unparse(data);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, fileName);
    }

    exportExcel(data: any[], fileName: string): void {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, fileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}${EXCEL_EXTENSION}`);
    }

    exportToPDF(tableId: string, fileName: string): void {
        const doc = new jsPDF();
        const tableElement = document.querySelector(tableId) as HTMLTableElement;
        if (!tableElement || !tableElement.rows?.length) return;
        autoTable(doc, { html: tableElement });
        doc.save(fileName);
    }

    generateBasePDF(title: string, moduleData: any[], columns: any[], fileName: string): void {
        const doc = new jsPDF({ orientation: 'landscape' });
        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: moduleData.map(row => columns.map(col => row[col.dataKey] || '')),
            theme: 'grid',
            startY: 20,
            styles: { fontSize: 8, cellPadding: 2 }
        });
        doc.save(`${fileName}.pdf`);
    }

    generateInventoryReport(
        title: string,
        account: IAccount,
        columns: string[],
        data: any[],
        base64Image: string | null,
        orientation: 'p' | 'portrait' | 'l' | 'landscape' = 'portrait',
        printMode: boolean = false
    ) {
        const doc = new jsPDF({ orientation });

        this.addHeader(doc, title, account, base64Image);
        this.addBody(doc, columns, data);
        this.addFooter(doc, data.length);

        if (printMode) {
            doc.autoPrint();
            const blobUrl = doc.output('bloburl');
            window.open(blobUrl);
        } else {
            doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
        }
    }


    addHeader(doc: jsPDF, title: string, account: IAccount, base64Image: string | null) {
        const marginLeft = 10;
        const marginTop = 10;
        const logoWidth = 45;
        const logoHeight = 20;
        const textStartX = marginLeft + logoWidth + 5;
        const textY = marginTop + 4;
        const lineSpacing = 4.5;
        const titleX = doc.internal.pageSize.width - marginLeft;
        if (base64Image) { doc.addImage(base64Image, 'JPEG', marginLeft, marginTop, logoWidth, logoHeight); }

        doc.setFontSize(8);
        doc.text(account.fullname, textStartX, textY);
        doc.text(account.fiscalname, textStartX, textY + lineSpacing);
        doc.text(account.fulladdress, textStartX, textY + lineSpacing * 2);
        doc.text(`Tel: ${account.phone} | ${account.email}`, textStartX, textY + lineSpacing * 3);
        doc.setFontSize(8);
        doc.text(title, titleX, marginTop + 5, { align: "right" });
        doc.setFontSize(8);
        doc.text(`generado: ${new Date().toLocaleString()}`, titleX, marginTop + 10, { align: "right" });
    }

    addBody(doc: jsPDF, columns: string[], data: any[]) {
        const updatedColumns = ['#', ...columns];
        const numberedData = data.map((row, index) => [index + 1, ...row]);

        autoTable(doc, {
            startY: 35,
            margin: { left: 10, right: 10 },
            head: [updatedColumns],
            body: numberedData,
            theme: 'plain',
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0,
                fontStyle: 'bold',
                fontSize: 7,
                halign: 'center',
                valign: 'middle'
            },
            styles: {
                fontSize: 7,
                cellPadding: { top: 0.8, bottom: 0.8, left: 3, right: 3 },
                lineWidth: 0,
                valign: 'middle'
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' },
                4: { halign: 'center' },
                5: { halign: 'center' },
                6: { halign: 'center' },
                7: { halign: 'center' },
                8: { halign: 'center' },
                9: { halign: 'center' },
                10: { halign: 'center' },
                11: { halign: 'center' },
                12: { halign: 'center' },
                13: { halign: 'center' },
                14: { halign: 'center' },
                15: { halign: 'center' }
            },
            willDrawCell: (data) => {
                const { x, y, width, height } = data.cell;
                const doc = data.doc;

                if (data.section === 'body') {
                    doc.setDrawColor(150, 150, 150);
                    doc.setLineWidth(0.2);
                    doc.line(x, y + height, x + width, y + height);
                    if (data.column.index === 0) {
                        doc.setDrawColor(150, 150, 150);
                        doc.setLineWidth(0.2);
                        doc.line(x + width, y, x + width, y + height);
                    }
                }
            }
        });
    }

    addFooter(doc: jsPDF, dataLength: number) {
        const pageCount = doc.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.width;
        const marginBottom = doc.internal.pageSize.height - 10;

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.text(`Total registros: ${dataLength}`, 10, marginBottom);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, marginBottom, { align: "center" });
            doc.text(`Versión: ${this.appVersion}`, pageWidth - 10, marginBottom, { align: "right" });
        }
    }

    async generatePDFBlob(selector: string, pageSize: 'letter' | 'legal' = 'letter'): Promise<Blob | null> {
        try {
            const element = document.querySelector(selector) as HTMLElement;
            if (!element) return null;

            await new Promise(resolve => setTimeout(resolve, 100));
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
            if (!(canvas instanceof HTMLCanvasElement)) return null;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: pageSize });
            const marginLeft = 10;
            const marginTop = 10;
            const pdfWidth = pdf.internal.pageSize.getWidth() - marginLeft * 2;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', marginLeft, marginTop, pdfWidth, pdfHeight);

            return pdf.output('blob');
        } catch {
            return null;
        }
    }

    injectPDFStyles(element: HTMLElement) {
        const style = document.createElement('style');
        style.innerHTML = `
            body { font-size: 12px; font-family: Arial, sans-serif; }
            .table { border-collapse: collapse; width: 100%; }
            .table th, .table td { border: 1px solid #000; padding: 5px; }
        `;
        element.appendChild(style);
    }

    async generatePDFBlobCart(selector: string, pageSize: 'letter' | 'legal' = 'letter'): Promise<Blob | null> {
        try {
            const element = document.querySelector(selector) as HTMLElement;
            if (!element) return null;
            await new Promise(resolve => setTimeout(resolve, 100));
            const canvas = await html2canvas(element, { scale: 1.2, useCORS: true, logging: false });
            if (!(canvas instanceof HTMLCanvasElement)) return null;
            const imgData = canvas.toDataURL('image/webp', 0.85);
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: pageSize });
            const marginLeft = 10;
            const marginTop = 10;
            const pdfWidth = pdf.internal.pageSize.getWidth() - marginLeft * 2;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'WEBP', marginLeft, marginTop, pdfWidth, pdfHeight);
            return pdf.output('blob');
        } catch {
            return null;
        }
    }

}
