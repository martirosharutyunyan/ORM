export interface sqlColumns {
    type:string
    columnName:string
}
export interface params {
    force?:boolean
    logging?:boolean
}
export interface conditionType {
    where:any
}
export interface contructorType {
    TABLENAME:string
    columns:sqlColumns
    params:params
}