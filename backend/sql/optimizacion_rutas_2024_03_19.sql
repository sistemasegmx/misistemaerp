USE misistemaerp_sistemasegmx;

-- Tabla para prospectos
CREATE TABLE IF NOT EXISTS prospect (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'prospect',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_prospect_code (code(255)),
    KEY idx_prospect_fiscalname (fiscalname(255)),
    CONSTRAINT fk_prospect_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para clientes
CREATE TABLE IF NOT EXISTS customer (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'customer',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_customer_code (code(255)),
    KEY idx_customer_fiscalname (fiscalname(255)),
    CONSTRAINT fk_customer_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para contactos
CREATE TABLE IF NOT EXISTS contact (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'contact',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_contact_code (code(255)),
    KEY idx_contact_fiscalname (fiscalname(255)),
    CONSTRAINT fk_contact_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para proveedores
CREATE TABLE IF NOT EXISTS supplier (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'supplier',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_supplier_code (code(255)),
    KEY idx_supplier_fiscalname (fiscalname(255)),
    CONSTRAINT fk_supplier_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para empleados
CREATE TABLE IF NOT EXISTS employee (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'employee',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_employee_code (code(255)),
    KEY idx_employee_fiscalname (fiscalname(255)),
    CONSTRAINT fk_employee_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para vendedores
CREATE TABLE IF NOT EXISTS salesperson (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'salesperson',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_salesperson_code (code(255)),
    KEY idx_salesperson_fiscalname (fiscalname(255)),
    CONSTRAINT fk_salesperson_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para distribuidores
CREATE TABLE IF NOT EXISTS distributor (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'distributor',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_distributor_code (code(255)),
    KEY idx_distributor_fiscalname (fiscalname(255)),
    CONSTRAINT fk_distributor_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para transportistas
CREATE TABLE IF NOT EXISTS carrier (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'carrier',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_carrier_code (code(255)),
    KEY idx_carrier_fiscalname (fiscalname(255)),
    CONSTRAINT fk_carrier_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para socios
CREATE TABLE IF NOT EXISTS partner (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'partner',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_partner_code (code(255)),
    KEY idx_partner_fiscalname (fiscalname(255)),
    CONSTRAINT fk_partner_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para afiliados
CREATE TABLE IF NOT EXISTS affiliate (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'affiliate',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_affiliate_code (code(255)),
    KEY idx_affiliate_fiscalname (fiscalname(255)),
    CONSTRAINT fk_affiliate_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para fabricantes
CREATE TABLE IF NOT EXISTS manufacturer (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'manufacturer',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_manufacturer_code (code(255)),
    KEY idx_manufacturer_fiscalname (fiscalname(255)),
    CONSTRAINT fk_manufacturer_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para asesores
CREATE TABLE IF NOT EXISTS advisor (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'advisor',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_advisor_code (code(255)),
    KEY idx_advisor_fiscalname (fiscalname(255)),
    CONSTRAINT fk_advisor_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para instituciones
CREATE TABLE IF NOT EXISTS institution (
    id            INT UNSIGNED AUTO_INCREMENT,
    accountid     INT NOT NULL,
    staffid       INT UNSIGNED NULL,
    code          VARCHAR(256) NULL,
    fullname      VARCHAR(1024) NULL,
    nationality   VARCHAR(64) NULL,
    rfc           VARCHAR(64) NULL,
    fiscalname    VARCHAR(1024) NULL,
    fulladdress   VARCHAR(1024) NULL,
    email         VARCHAR(1024) NULL,
    phone         VARCHAR(64) NULL,
    level         INT DEFAULT 1,
    type          VARCHAR(64) NOT NULL DEFAULT 'institution',
    image         VARCHAR(1024) DEFAULT '/assets/img/nofoto.png',
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NOT NULL,
    modified_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_institution_code (code(255)),
    KEY idx_institution_fiscalname (fiscalname(255)),
    CONSTRAINT fk_institution_account FOREIGN KEY (accountid) 
        REFERENCES account (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;