export function useSort() {
    const sortString = ref("Ascending")

    function sort(anyArray: any[]) {
        if(sortString.value === 'Ascending')
        {
            anyArray.sort((itemA, itemB) => {
                if(itemA.launch_date_local > itemB.launch_date_local)
                {
                    return 1;
                }
                if(itemA.launch_date_local < itemB.launch_date_local)
                {
                    return -1;
                }
                return 0;
            })
        }else{
            anyArray.sort((itemA, itemB) => {
                if(itemA.launch_date_local > itemB.launch_date_local)
                {
                    return -1;
                }
                if(itemA.launch_date_local < itemB.launch_date_local)
                {
                    return 1;
                }
                return 0;
            })
        }
    }

    return {
        sortString,
        sort
    }
}