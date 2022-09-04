export default function (context, inject) {
    const addNumberInTableData = (dataList, pageInfo) => {
        if (!dataList) {
            return []
        }
        dataList.forEach((item, index) => {
            const page = pageInfo.page
            const size = pageInfo.size

            item.number = (page - 1) * size + index + 1
        })

        return dataList
    }

    const setStorageItem = (name, data) => {
        window.localStorage.setItem(name, JSON.stringify(data))
    }

    // this.$addNumberInTableData(datalist) 처럼 사용할 수 있게 한다.
  inject('addNumberInTableData', addNumberInTableData)
    inject('setStorageItem', setStorageItem)
}