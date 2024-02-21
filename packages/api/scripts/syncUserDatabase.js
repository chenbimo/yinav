import { syncUserDatabase } from '@yicode/sync-user-database';
import { appConfig } from '@yicode/yiapi/config/appConfig.js';
import { sysConfig } from '@yicode/yiapi/config/sysConfig.js';
import { fieldType } from '@yicode/yiapi/config/fieldType.js';
syncUserDatabase(sysConfig, appConfig, fieldType);
