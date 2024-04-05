export function useConvertToDate() {
    function convertToDate(dateString: string, yearStr?: string, filters?: any[]) {
        const dStr: string = dateString;
        const res: Date = new Date(dStr);
        if(!filters?.includes(yearStr) && filters !== null)
        {
            filters?.push(yearStr);
        }
        return res;
    }

    return {
        convertToDate
    }
}