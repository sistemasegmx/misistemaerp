USE misistemaerp_sistemasegmx;

-- Tabla para prospectos
CREATE TABLE IF NOT EXISTS prospect (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    company       VARCHAR(255) NULL,
    position      VARCHAR(255) NULL,
    interest_level INT DEFAULT 1,
    source        VARCHAR(255) NULL,
    notes         TEXT NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_contact_date DATETIME NULL,
    assigned_to   INT UNSIGNED NULL,
    potential_value DECIMAL(10, 2) NULL,
    industry      VARCHAR(255) NULL,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    social_media  VARCHAR(255) NULL,
    preferred_contact_method VARCHAR(255) NULL,
    tags          TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para clientes
CREATE TABLE IF NOT EXISTS customer (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    company       VARCHAR(255) NULL,
    tax_id        VARCHAR(64) NULL,
    customer_type VARCHAR(255) NULL,
    credit_limit  DECIMAL(10, 2) NULL,
    payment_terms VARCHAR(255) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_purchase_date DATETIME NULL,
    total_purchases DECIMAL(10, 2) NULL,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    industry      VARCHAR(255) NULL,
    assigned_salesperson INT UNSIGNED NULL,
    preferred_payment_method VARCHAR(255) NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    customer_since DATE NULL,
    loyalty_points INT NULL,
    preferred_shipping_method VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para contactos
CREATE TABLE IF NOT EXISTS contact (
    id            INT UNSIGNED AUTO_INCREMENT,
    first_name    VARCHAR(255) NULL,
    last_name     VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    mobile        VARCHAR(64) NULL,
    position      VARCHAR(255) NULL,
    department    VARCHAR(255) NULL,
    related_entity_id INT UNSIGNED NULL,
    related_entity_type VARCHAR(255) NULL,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    notes         TEXT NULL,
    preferred_contact_method VARCHAR(255) NULL,
    birth_date    DATE NULL,
    anniversary_date DATE NULL,
    social_media  VARCHAR(255) NULL,
    tags          TEXT NULL,
    assigned_to   INT UNSIGNED NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para proveedores
CREATE TABLE IF NOT EXISTS supplier (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    tax_id        VARCHAR(64) NULL,
    supplier_type VARCHAR(255) NULL,
    payment_terms VARCHAR(255) NULL,
    credit_limit  DECIMAL(10, 2) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_order_date DATETIME NULL,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    industry      VARCHAR(255) NULL,
    primary_contact_id INT UNSIGNED NULL,
    preferred_payment_method VARCHAR(255) NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    supplier_since DATE NULL,
    quality_rating INT NULL,
    delivery_rating INT NULL,
    price_rating  INT NULL,
    certifications TEXT NULL,
    banking_info  TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para empleados
CREATE TABLE IF NOT EXISTS employee (
    id            INT UNSIGNED AUTO_INCREMENT,
    first_name    VARCHAR(255) NULL,
    last_name     VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    mobile        VARCHAR(64) NULL,
    employee_id   VARCHAR(255) NULL,
    department_id INT UNSIGNED NULL,
    position      VARCHAR(255) NULL,
    hire_date     DATE NULL,
    termination_date DATE NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    emergency_contact TEXT NULL,
    birth_date    DATE NULL,
    tax_id        VARCHAR(64) NULL,
    banking_info  TEXT NULL,
    salary        DECIMAL(10, 2) NULL,
    benefits      TEXT NULL,
    skills        TEXT NULL,
    certifications TEXT NULL,
    education     TEXT NULL,
    notes         TEXT NULL,
    supervisor_id INT UNSIGNED NULL,
    work_schedule VARCHAR(255) NULL,
    access_level  VARCHAR(255) NULL,
    profile_photo VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para vendedores
CREATE TABLE IF NOT EXISTS salesperson (
    id            INT UNSIGNED AUTO_INCREMENT,
    first_name    VARCHAR(255) NULL,
    last_name     VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    mobile        VARCHAR(64) NULL,
    employee_id   INT UNSIGNED NULL,
    territory     VARCHAR(255) NULL,
    commission_rate DECIMAL(5, 2) NULL,
    sales_target  DECIMAL(10, 2) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    specialization VARCHAR(255) NULL,
    total_sales   DECIMAL(10, 2) NULL,
    current_month_sales DECIMAL(10, 2) NULL,
    last_sale_date DATETIME NULL,
    performance_rating INT NULL,
    notes         TEXT NULL,
    supervisor_id INT UNSIGNED NULL,
    assigned_customers TEXT NULL,
    assigned_prospects TEXT NULL,
    sales_history TEXT NULL,
    profile_photo VARCHAR(255) NULL,
    social_media  VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para distribuidores
CREATE TABLE IF NOT EXISTS distributor (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    tax_id        VARCHAR(64) NULL,
    distribution_area VARCHAR(255) NULL,
    distribution_type VARCHAR(255) NULL,
    payment_terms VARCHAR(255) NULL,
    credit_limit  DECIMAL(10, 2) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    warehouse_locations TEXT NULL,
    primary_contact_id INT UNSIGNED NULL,
    preferred_payment_method VARCHAR(255) NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    distribution_since DATE NULL,
    service_rating INT NULL,
    delivery_rating INT NULL,
    price_rating  INT NULL,
    certifications TEXT NULL,
    banking_info  TEXT NULL,
    inventory_capacity VARCHAR(255) NULL,
    transportation_fleet TEXT NULL,
    service_coverage TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para transportistas
CREATE TABLE IF NOT EXISTS carrier (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    tax_id        VARCHAR(64) NULL,
    carrier_type  VARCHAR(255) NULL,
    service_areas TEXT NULL,
    payment_terms VARCHAR(255) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    fleet_size    INT NULL,
    fleet_type    VARCHAR(255) NULL,
    primary_contact_id INT UNSIGNED NULL,
    preferred_payment_method VARCHAR(255) NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    service_since DATE NULL,
    delivery_rating INT NULL,
    price_rating  INT NULL,
    certifications TEXT NULL,
    banking_info  TEXT NULL,
    insurance_info TEXT NULL,
    tracking_system VARCHAR(255) NULL,
    service_coverage TEXT NULL,
    special_handling_capabilities TEXT NULL,
    operating_hours VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para socios
CREATE TABLE IF NOT EXISTS partner (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    tax_id        VARCHAR(64) NULL,
    partner_type  VARCHAR(255) NULL,
    partnership_start_date DATE NULL,
    partnership_end_date DATE NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    industry      VARCHAR(255) NULL,
    primary_contact_id INT UNSIGNED NULL,
    partnership_terms TEXT NULL,
    investment_amount DECIMAL(10, 2) NULL,
    ownership_percentage DECIMAL(5, 2) NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    strategic_goals TEXT NULL,
    contribution_areas TEXT NULL,
    meeting_schedule VARCHAR(255) NULL,
    reporting_requirements TEXT NULL,
    banking_info  TEXT NULL,
    legal_documents TEXT NULL,
    performance_metrics TEXT NULL,
    social_media  VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para afiliados
CREATE TABLE IF NOT EXISTS affiliate (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    tax_id        VARCHAR(64) NULL,
    affiliate_type VARCHAR(255) NULL,
    commission_rate DECIMAL(5, 2) NULL,
    payment_terms VARCHAR(255) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    promotion_channels TEXT NULL,
    primary_contact_id INT UNSIGNED NULL,
    preferred_payment_method VARCHAR(255) NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    affiliate_since DATE NULL,
    total_referrals INT NULL,
    total_earnings DECIMAL(10, 2) NULL,
    current_month_earnings DECIMAL(10, 2) NULL,
    banking_info  TEXT NULL,
    promotion_materials TEXT NULL,
    tracking_code VARCHAR(255) NULL,
    performance_metrics TEXT NULL,
    social_media  VARCHAR(255) NULL,
    promotion_areas TEXT NULL,
    target_audience TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para fabricantes
CREATE TABLE IF NOT EXISTS manufacturer (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    tax_id        VARCHAR(64) NULL,
    manufacturer_type VARCHAR(255) NULL,
    payment_terms VARCHAR(255) NULL,
    credit_limit  DECIMAL(10, 2) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    facility_locations TEXT NULL,
    primary_contact_id INT UNSIGNED NULL,
    preferred_payment_method VARCHAR(255) NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    manufacturing_since DATE NULL,
    quality_rating INT NULL,
    delivery_rating INT NULL,
    price_rating  INT NULL,
    certifications TEXT NULL,
    banking_info  TEXT NULL,
    production_capacity VARCHAR(255) NULL,
    specialization VARCHAR(255) NULL,
    equipment_capabilities TEXT NULL,
    quality_control_processes TEXT NULL,
    environmental_compliance TEXT NULL,
    safety_records TEXT NULL,
    product_categories TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para asesores
CREATE TABLE IF NOT EXISTS advisor (
    id            INT UNSIGNED AUTO_INCREMENT,
    first_name    VARCHAR(255) NULL,
    last_name     VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    mobile        VARCHAR(64) NULL,
    advisor_type  VARCHAR(255) NULL,
    specialization VARCHAR(255) NULL,
    hourly_rate   DECIMAL(10, 2) NULL,
    payment_terms VARCHAR(255) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    company       VARCHAR(255) NULL,
    position      VARCHAR(255) NULL,
    credentials   TEXT NULL,
    experience_years INT NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    availability  VARCHAR(255) NULL,
    consulting_areas TEXT NULL,
    client_history TEXT NULL,
    success_metrics TEXT NULL,
    banking_info  TEXT NULL,
    social_media  VARCHAR(255) NULL,
    profile_photo VARCHAR(255) NULL,
    languages     VARCHAR(255) NULL,
    certifications TEXT NULL,
    publications  TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para instituciones
CREATE TABLE IF NOT EXISTS institution (
    id            INT UNSIGNED AUTO_INCREMENT,
    name          VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(64) NULL,
    tax_id        VARCHAR(64) NULL,
    institution_type VARCHAR(255) NULL,
    registration_number VARCHAR(255) NULL,
    status        VARCHAR(64) DEFAULT 'activo',
    created_by    INT UNSIGNED NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by   INT UNSIGNED NULL,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(255) NULL,
    country       VARCHAR(255) NULL,
    postal_code   VARCHAR(20) NULL,
    website       VARCHAR(255) NULL,
    primary_contact_id INT UNSIGNED NULL,
    notes         TEXT NULL,
    tags          TEXT NULL,
    institution_since DATE NULL,
    accreditation TEXT NULL,
    licenses      TEXT NULL,
    regulatory_compliance TEXT NULL,
    operating_hours VARCHAR(255) NULL,
    services_offered TEXT NULL,
    facilities    TEXT NULL,
    membership_programs TEXT NULL,
    partnership_agreements TEXT NULL,
    social_media  VARCHAR(255) NULL,
    publications  TEXT NULL,
    events        TEXT NULL,
    funding_sources TEXT NULL,
    governing_body VARCHAR(255) NULL,
    mission_statement TEXT NULL,
    annual_reports TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;