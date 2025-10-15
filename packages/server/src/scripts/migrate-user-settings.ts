import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SettingsService } from '../users/services/settings.service';
import { UsersService } from '../users/users.service';

async function migrateUserSettings() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const settingsService = app.get(SettingsService);
  const usersService = app.get(UsersService);

  try {
    console.log('Starting user settings migration...');

    // Get all users
    const users = await usersService.findAll({ offset: 0, limit: 1000 });
    console.log(`Found ${users.data.length} users to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users.data) {
      try {
        // Check if settings already exist
        const existingSettings = await settingsService.getUserSettings(
          user._id as string,
        );

        if (existingSettings) {
          console.log(
            `Settings already exist for user ${user.name} (${user._id})`,
          );
          skippedCount++;
          continue;
        }

        // Initialize default settings
        await settingsService.initializeUserSettings(user._id as string);
        console.log(`Initialized settings for user ${user.name} (${user._id})`);
        migratedCount++;
      } catch (error) {
        console.error(
          `Error migrating settings for user ${user._id}:`,
          error.message,
        );
      }
    }

    console.log(`Migration completed:`);
    console.log(`- Migrated: ${migratedCount} users`);
    console.log(`- Skipped: ${skippedCount} users`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await app.close();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateUserSettings()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateUserSettings };
