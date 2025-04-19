<?php

namespace src\core;

use PHPMailer\PHPMailer\PHPMailer;
use src\app\classes\helpers;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

class emailService
{
    public static function RegisteredAdminNotificaction(string $message): bool
    {
        $mail = new PHPMailer(true);
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'sistemasegmx.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@misistemaerp.sistemasegmx.com';
        $mail->Password = 'BEvL^L&&$VLp';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->setFrom('info@misistemaerp.sistemasegmx.com', 'Sistemas EGMX');
        $mail->addAddress('webmaster@sistemasegmx.com');
        $mail->isHTML(true);
        $mail->Subject = "Nuevo usuario registrado en Sistemas EGMX";
        $mail->Body = "Te informamos que se ha registrado un usuario nuevo en https://misistemaerp.sistemasegmx.com\n<br /><br />Correo: $message";

        $return = $mail->send() ? true : false;

        return $return;

    }

    public static function sendActivationEmail(string $email, string $api_key, string $username): bool
    {
        $activationLink = 'https://misistemaerp.sistemasegmx.com/auth/activate?' . $api_key;

        $mail = new PHPMailer(true);
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'sistemasegmx.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@misistemaerp.sistemasegmx.com';
        $mail->Password = 'BEvL^L&&$VLp';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->setFrom('info@misistemaerp.sistemasegmx.com', 'Sistemas EGMX');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = "Bienvenido a Sistemas EGMX - Su cuenta necesita activarse";

        $mail->msgHTML('
            <div style="width:100%; background:#eee; position:relative; font-family:sans-serif; padding-bottom:40px">
                <center>
                    <h3 style="font-weight:100; color:#999">Bienvenido a Sistemas EGMX</h3>
                    <h3 style="font-weight:100; color:#999">Su cuenta necesita activarse</h3>
                </center>
                <div style="position:relative; margin:auto; width:600px; background:white; padding:20px">
                    <center>
                        <img style="padding:20px, width:10%" src="https://misistemaerp.sistemasegmx.com/assets/media/logos/logoH.png">
                        <h3 style="font-weight:100; color:#999">USUARIO<br /><br />' . $username . '</h3>
                        <hr style="border:1px solid #ccc; width:80%">
                        <h4 style="font-weight:100; color:#999; padding:0 20px">Estas a un paso de completar tu registro de cuenta, solo da click en el siguiente enlace</h4>
                        <a href="' . $activationLink . '" target="_blank"
                            style="text-decoration:none">
                            <div style="line-height:60px; background:#0aa; width:60%; color:white">Verifique su direcci&oacute;n de Correo electr&oacute;nico</div>
                        </a>
                        <br>
                        <hr style="border:1px solid #ccc; width:80%">
                        <h5 style="font-weight:100; color:#999">Si no es usted, puede ignorar este correo electr&oacute;nico y eliminarlo.</h5>
                    </center>
                </div>
            </div>
        ');

        $return = $mail->send() ? true : false;

        self::RegisteredAdminNotificaction($email);

        return $return;
    }

    public static function sendTmpPwd(string $email, string $pwd): bool
    {

        $activationLink = 'https://misistemaerp.sistemasegmx.com';

        $mail = new PHPMailer(true);
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'sistemasegmx.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@misistemaerp.sistemasegmx.com';
        $mail->Password = 'BEvL^L&&$VLp';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->setFrom('info@misistemaerp.sistemasegmx.com', 'Sistemas EGMX');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Solicitud de nueva contrasena';

        $mail->msgHTML('
            <div style="width:100%; background:#eee; position:relative; font-family:sans-serif; padding-bottom:40px">
                <center>
                    <h3 style="font-weight:100; color:#999">Sistemas EGMX</h3>
                </center>
                <div style="position:relative; margin:auto; width:600px; background:white; padding:20px">
                    <center>
                        <img style="padding:20px, width:10%" src="https://misistemaerp.sistemasegmx.com/assets/media/logos/logoH.png">
                        <h3 style="font-weight:100; color:#999">Apreciable usuario, su nueva contrase&ntilde;a ha sido enviada:<br /><br />' . $pwd . '</h3>
                        <hr style="border:1px solid #ccc; width:80%">
                        <h4 style="font-weight:100; color:#999; padding:0 20px">Ingrese nuevamente al sitio con esta contrase&ntilde;a y recuerde cambiarla en el panel de perfil de usuario</h4>
                        <a href="' . $activationLink . '" target="_blank"
                            style="text-decoration:none">
                            <div style="line-height:60px; background:#0aa; width:60%; color:white">Haga click aqu&iacute;</div>
                        </a>
                        <br>
                        <hr style="border:1px solid #ccc; width:80%">
                        <h5 style="font-weight:100; color:#999">Si no es usted, puede ignorar este correo electr&oacute;nico y eliminarlo.</h5>
                    </center>
                </div>
            </div>
        ');

        $return = $mail->send() ? true : false;

        return $return;
    }

    public static function sendEmailWithPDF(string $email, array $file): bool
    {
        $return = false;
        $mail = new PHPMailer(true);

        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'sistemasegmx.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@misistemaerp.sistemasegmx.com';
        $mail->Password = 'BEvL^L&&$VLp';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->CharSet = 'UTF-8';
        $mail->setFrom('info@misistemaerp.sistemasegmx.com', 'Sistemas EGMX');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Su archivo adjunto está listo para ser descargado';

        if (!empty($file['tmp_name']) && mime_content_type($file['tmp_name']) === 'application/pdf') {
            $mail->addAttachment($file['tmp_name'], $file['name']);
        } else {
            throw new \Exception('El archivo adjunto no es un PDF válido.');
        }

        $mail->msgHTML('
            <div style="width:100%; background:#f4f4f4; font-family:sans-serif; padding:40px 0;">
                <div style="max-width:600px; background:#fff; margin:auto; padding:20px; box-shadow:0 0 10px #ccc; text-align:center;">
                    <img style="padding:20px; width:250px" src="https://misistemaerp.sistemasegmx.com/assets/media/logos/logoH.png">
                    <h3 style="color:#333;">Estimado usuario,</h3>
                    <p style="color:#555; line-height:1.5;">Su solicitud ha sido procesada con éxito.
                    <br />Adjunto encontrará su documento en formato PDF.</p>
                    <p style="color:#555; line-height:1.5;">Consulta asistencia con nuestro equipo de soporte para ayudarle.</p>
                    <hr style="border:1px solid #ccc; width:80%">
                    <p style="color:#777; font-size:12px;">
                        Este es un mensaje automático, por favor no responda. Si necesita ayuda, contáctenos por los canales oficiales.
                    </p>
                    <p style="color:#777; font-size:12px;">Gracias por elegir nuestros servicios.</p>
                </div>
            </div>
        ');


        if ($mail->send())
            $return = true;

        return $return;
    }
}