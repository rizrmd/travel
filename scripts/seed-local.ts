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

    let user = await userRepository.findOne({ where: { email: defaultUserEmail } });
    if (!user) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('password123', salt);

        user = userRepository.create({
            email: defaultUserEmail,
            password: hashedPassword,
            fullName: 'Super Admin',
            role: UserRole.SUPER_ADMIN,
            status: UserStatus.ACTIVE,
            tenantId: tenant.id,
            emailVerified: true,
        });
        await userRepository.save(user);
        console.log('User created');
    } else {
        console.log('User already exists');
    }

    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
