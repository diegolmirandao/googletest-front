import { MCurrency } from '../models/currency';
import { MFormattedPermission } from '../models/user/formattedPermission';
import { MPermission } from '../models/user/permission';
import * as dayjs from 'dayjs'

/**
 * Formats number
 * @param number number to format
 * @returns formatted number
 */
export const formatNumber = (number: number | string | undefined) => {
    return Number(number);
};

/**
 * Formats number to currency string
 * @param amount amount to format
 * @param currency currency model
 * @returns formatted currency string
 */
export const formatMoney = (amount?: string | number, currency?: MCurrency):string => {
    return Intl.NumberFormat('fullwide', {
        style: 'decimal'
    }).format(Number(amount)) + ' ' + currency?.abbreviation;
};

/**
 * Format date
 * @param date date to format
 * @returns formatted date
 */
export const formatDate = (date: string | undefined | null): string | null => {
    let format = 'DD-MM-YYYY HH:mm:ss';
    if (!date) return null;
    return dayjs((date)).format(format);
};

export const formatPermission = (permission: MPermission): MFormattedPermission => {
    const permissionSplit = permission.name.split('.')

    return new MFormattedPermission({action: permissionSplit[1], subject: permissionSplit[0]})
}