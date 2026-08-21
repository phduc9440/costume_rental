CREATE DATABASE IF NOT EXISTS `return_db`;
USE `return_db`;

CREATE TABLE loi (
    id VARCHAR(255) PRIMARY KEY,
    ten_loi VARCHAR(255) NOT NULL,
    muc_phat FLOAT NOT NULL,
    mo_ta TEXT
);

CREATE TABLE phieu_tra (
    id VARCHAR(255) PRIMARY KEY,
    ngay_lap DATETIME NOT NULL,
    nhan_vien_id VARCHAR(255),
    phieu_thue_id VARCHAR(255)
);

CREATE TABLE chi_tiet_tra (
    id VARCHAR(255) PRIMARY KEY,
    so_luong INT NOT NULL,
    trang_phuc_id VARCHAR(255),
    phieu_tra_id VARCHAR(255),
    CONSTRAINT fk_phieu_tra FOREIGN KEY (phieu_tra_id) REFERENCES phieu_tra(id) ON DELETE CASCADE
);

CREATE TABLE chi_tiet_loi (
    id VARCHAR(255) PRIMARY KEY,
    tong_loi INT NOT NULL,
    loi_id VARCHAR(255),
    chi_tiet_tra_id VARCHAR(255),
    CONSTRAINT fk_loi FOREIGN KEY (loi_id) REFERENCES loi(id),
    CONSTRAINT fk_chi_tiet_tra FOREIGN KEY (chi_tiet_tra_id) REFERENCES chi_tiet_tra(id) ON DELETE CASCADE
);

-- ==============================================
-- DỮ LIỆU MẪU (DUMMY DATA)
-- ==============================================

-- 1. Dữ liệu bảng lỗi hỏng phạt (Lỗi thường gặp)
INSERT INTO loi (id, ten_loi, muc_phat, mo_ta) VALUES 
('uuid-loi-01', 'Rách trang phục (nhỏ)', 50000, 'Rách nhỏ dưới 5cm, có thể khâu lại được.'),
('uuid-loi-02', 'Rách trang phục (lớn)', 200000, 'Rách lớn hoặc ở vị trí khó sửa, cần thay một mảng vải.'),
('uuid-loi-03', 'Bẩn cứng đầu', 30000, 'Dính vết xịt màu, dầu mỡ khó giặt ra.'),
('uuid-loi-04', 'Mất cúc / phụ kiện nhỏ', 10000, 'Mất cúc áo, hỏng dây kéo hoặc phụ kiện đính kèm nhỏ.'),
('uuid-loi-05', 'Cháy sém, hỏng hoàn toàn', 500000, 'Đồ bị cháy xém hoặc không thể khắc phục được, đền bù theo giá trị trang phục.');

-- 2. Dữ liệu bảng Phiếu trả
-- Giả sử ta có 2 phiếu trả trong hệ thống
-- Phiếu 1: Của khách hàng kh-001 trả đồ hôm nay
INSERT INTO phieu_tra (id, ngay_lap, nhan_vien_id, phieu_thue_id) VALUES 
('uuid-phieutra-01', '2026-04-20 09:00:00', 'uuid-nv-01', 'uuid-phieuthue-001'),
('uuid-phieutra-02', '2026-04-19 14:30:00', 'uuid-nv-01', 'uuid-phieuthue-002');

-- 3. Dữ liệu bảng Chi tiết trả
-- Trang phục id: tp-01, tp-02, ...
INSERT INTO chi_tiet_tra (id, so_luong, trang_phuc_id, phieu_tra_id) VALUES 
-- Chi tiết cho phiếu trả 1 (Có 2 đồ được trả)
('uuid-ctt-01', 1, 'uuid-tp-001', 'uuid-phieutra-01'),
('uuid-ctt-02', 2, 'uuid-tp-002', 'uuid-phieutra-01'),

-- Chi tiết cho phiếu trả 2 (Có 1 đồ được trả)
('uuid-ctt-03', 1, 'uuid-tp-003', 'uuid-phieutra-02');

-- 4. Dữ liệu bảng Chi tiết lỗi (Cho chi tiết đồ bị hỏng)
-- Trong Phiếu 1, đồ thứ nhất ('uuid-ctt-01') bị lỗi mất cúc và bẩn
INSERT INTO chi_tiet_loi (id, tong_loi, loi_id, chi_tiet_tra_id) VALUES 
('uuid-ctl-01', 1, 'uuid-loi-01', 'uuid-ctt-01'), -- Rách nhỏ
('uuid-ctl-02', 1, 'uuid-loi-04', 'uuid-ctt-01'); -- Mất cúc

-- Đồ 2 trong phiếu 1 và Đồ trong phiếu 2 không bị lỗi gì
