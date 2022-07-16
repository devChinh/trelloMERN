export const mapOrder = (array , order , key) => {
    console.log('============= array',array)
    array.sort((a,b) => order.indexOf(a[key]) - order.indexOf(b[key]));
    return array
}