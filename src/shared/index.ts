import * as dotenv from 'dotenv-override';
// Because: https://github.com/motdotla/node-lambda/pull/369
dotenv.config({ override: true });

import './extensions';
