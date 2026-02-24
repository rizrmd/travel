INSERT INTO users (tenant_id, email, password, full_name, role, status, email_verified, failed_login_attempts) 
VALUES 
('1cba65d4-c6ba-4b3a-a3b8-a71b3f6ee8da', 'agency_owner@example.com', '$2b$10$vdWqCpfb.6bOWwsStJruuu1.JWJwYEzo67fmjUjoWCLiotrJ3N.Vm', 'Agency Owner', 'agency_owner', 'active', true, 0),
('1cba65d4-c6ba-4b3a-a3b8-a71b3f6ee8da', 'agent@example.com', '$2b$10$vdWqCpfb.6bOWwsStJruuu1.JWJwYEzo67fmjUjoWCLiotrJ3N.Vm', 'Travel Agent', 'agent', 'active', true, 0),
('1cba65d4-c6ba-4b3a-a3b8-a71b3f6ee8da', 'affiliate@example.com', '$2b$10$vdWqCpfb.6bOWwsStJruuu1.JWJwYEzo67fmjUjoWCLiotrJ3N.Vm', 'Affiliate Partner', 'affiliate', 'active', true, 0),
('1cba65d4-c6ba-4b3a-a3b8-a71b3f6ee8da', 'staff_admin@example.com', '$2b$10$vdWqCpfb.6bOWwsStJruuu1.JWJwYEzo67fmjUjoWCLiotrJ3N.Vm', 'Staff Admin', 'admin', 'active', true, 0),
('1cba65d4-c6ba-4b3a-a3b8-a71b3f6ee8da', 'jamaah@example.com', '$2b$10$vdWqCpfb.6bOWwsStJruuu1.JWJwYEzo67fmjUjoWCLiotrJ3N.Vm', 'Jamaah', 'jamaah', 'active', true, 0),
('1cba65d4-c6ba-4b3a-a3b8-a71b3f6ee8da', 'family@example.com', '$2b$10$vdWqCpfb.6bOWwsStJruuu1.JWJwYEzo67fmjUjoWCLiotrJ3N.Vm', 'Family Member', 'family', 'active', true, 0)
ON CONFLICT (tenant_id, email) DO NOTHING;
