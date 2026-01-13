-- Reset Admin Password
-- Password: admin123
-- Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

USE iware_perizinan;

-- Hapus admin yang ada (jika ada)
DELETE FROM users WHERE username = 'admin';

-- Insert admin baru dengan password yang sudah di-hash
INSERT INTO users (username, password, nama, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');

-- Verify
SELECT id, username, nama, role, created_at FROM users WHERE username = 'admin';
