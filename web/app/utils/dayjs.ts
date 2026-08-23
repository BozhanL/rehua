import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// set default timezone to New Zealand time
dayjs.tz.setDefault('Pacific/Auckland');

export default dayjs;
