export const formatMonthYear = (dateString: string): string => {
    if (!dateString) return dateString;

    // Check if format is YYYY-MM
    const match = dateString.match(/^(\d{4})-(\d{2})$/);
    if (!match) return dateString;

    const year = match[1];
    const month = parseInt(match[2], 10);

    const monthsIndo = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    if (month >= 1 && month <= 12) {
        return `${monthsIndo[month - 1]} ${year}`;
    }

    return dateString;
};
