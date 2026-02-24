import { AppDataSource } from '../src/database/data-source';
import { UserEntity } from '../src/users/entities/user.entity';
import { TenantEntity } from '../src/tenants/entities/tenant.entity';
import { TenantStatus, TenantTier } from '../src/tenants/domain/tenant';
import { UserRole, UserStatus } from '../src/users/domain/user';
import * as bcrypt from 'bcrypt';

async function seed() {
    await AppDataSource.initialize();

    const tenantRepository = AppDataSource.getRepository(TenantEntity);
    const userRepository = AppDataSource.getRepository(UserEntity);

    const defaultTenantSlug = 'default';
    const defaultUserEmail = 'admin@example.com';

    let tenant = await tenantRepository.findOne({ where: { slug: defaultTenantSlug } });
    if (!tenant) {
        tenant = tenantRepository.create({
            name: 'Travel Umroh Default',
            slug: defaultTenantSlug,
            ownerEmail: defaultUserEmail,
            ownerPhone: '081234567890',
            address: 'Default Address',
            status: TenantStatus.ACTIVE,
            tier: TenantTier.ENTERPRISE,
        });
        await tenantRepository.save(tenant);
        console.log('Tenant created');
    } else {
        console.log('Tenant already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);

    const usersToSeed = [
        { email: 'admin@example.com', fullName: 'Super Admin', role: UserRole.SUPER_ADMIN },
        { email: 'agency_owner@example.com', fullName: 'Agency Owner', role: UserRole.AGENCY_OWNER },
        { email: 'staff_admin@example.com', fullName: 'Staff Admin', role: UserRole.ADMIN },
        { email: 'agent@example.com', fullName: 'Travel Agent', role: UserRole.AGENT },
        { email: 'affiliate@example.com', fullName: 'Affiliate Partner', role: UserRole.AFFILIATE },
        { email: 'jamaah@example.com', fullName: 'Jamaah Customer', role: UserRole.JAMAAH },
        { email: 'family@example.com', fullName: 'Family Member', role: UserRole.FAMILY },
    ];

    for (const userData of usersToSeed) {
        let user = await userRepository.findOne({ where: { email: userData.email } });
        if (!user) {
            user = userRepository.create({
                email: userData.email,
                password: hashedPassword,
                fullName: userData.fullName,
                role: userData.role,
                status: UserStatus.ACTIVE,
                tenantId: tenant.id,
                emailVerified: true,
            });
            await userRepository.save(user);
            console.log(`User created: ${userData.email} (${userData.role})`);
        } else {
            console.log(`User already exists: ${userData.email}`);
        }
    }

    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
