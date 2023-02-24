import { convertDateTime, singular, traverseValue } from '~/assets/js/utils.js'

export default function (
    data: any,
    callback: Function = () => {},
    models: any = null,
    additionalParams = ['created_at', 'deleted_at'],
    headerInfo = null,
) {
    // new models object

    // if (!data?.models) Vue.set(data, 'models', {})
    let mappedModels: any = {}
    for (const param of additionalParams)
        Object.assign(mappedModels, models?.[param] && { [param]: models[param] })

    // if existing record
    if (data.fields && models?.id) {
        mappedModels.id = models.id.toString()

        // loop for every field in the modal form
        for (const [key, field] of <any>Object.entries(data.fields)) {
            // database field name
            const fieldName = field.fieldName ?? key
            const multiple = field.attrs?.multiple

            // model's other relationships
            const fieldGroup = field.fieldGroup ?? (typeof field.addMore === 'string' ? field.addMore : null)
            let groupModel = fieldGroup ? traverseValue(models, fieldGroup) : null

            // if iteration is for model's other relationship
            // prepare connection data
            if (fieldGroup && groupModel) {
                // initialize group object
                if (!mappedModels.groupIds) mappedModels.groupIds = {}

                if (Array.isArray(groupModel)) {
                    console.log('groupmodel')
                    if (!multiple && !field.addMore) {
                        // if group model is array and no multiple or add more requirement, get first
                        groupModel = groupModel[0]
                    }
                    // insert to groupIds collection
                    else {
                        const getGroupIds = (values: any): any =>
                            Array.isArray(values)
                                ? values.map((value) => getGroupIds(value))
                                : { id: values?.id }
                        mappedModels.groupIds[key] = getGroupIds(Object.values(groupModel))
                    }
                }
                // if not array, insert to groupIds collection
                if (groupModel?.id) mappedModels.groupIds[key] = { id: groupModel?.id }
            }

            // re-assign model to current iteration's parent model
            let model = groupModel ?? models

            // get current iteration's field data from model
            if (Array.isArray(model)) {
                const getNestedModel = (values: any) =>
                    values.map((value: any) =>
                        Array.isArray(value) ? getNestedModel(value) : value[fieldName] ?? value[key],
                    )
                model = getNestedModel(model)
            } else {
                model =
                    model[fieldName?.toLowerCase()] ??
                    model[key?.toLowerCase()] ??
                    model[singular(fieldName, false)] ??
                    model[singular(key, false)]
            }

            // if field is date, reformat mysql date to js
            if (field.attrs?.type === 'datetime-local') model = convertDateTime(model)

            // convert field to array if multiple
            if (!Array.isArray(model) && multiple) model = model === undefined ? [] : [model]

            // convert array to field if data is array and field is not multiple
            if (Array.isArray(model) && !multiple && !field.addMore) model = model[0]
            // set modal data count to # of add more fields
            else if (field.addMore && model?.length) {
                const getNestedCount = (values: any) =>
                    values.every((item: any) => Array.isArray(item))
                        ? values.map((value: any) => (value.length > 0 ? getNestedCount(value) : 1))
                        : values.length
                data.fields[key].count = getNestedCount(model)
            }

            // make sure id is a string to prevent missing data
            if (typeof model === 'object')
                if (Array.isArray(model) && model[0]?.id && typeof model[0]?.id !== 'string')
                    model = model.map((x) => ({ ...x, id: x.id.toString() }))
                else if (model?.id && typeof model?.id !== 'string') model.id = model.id.toString()

            // assign valid data to mappedModels
            if (!((typeof model === 'string' || Array.isArray(model)) && !model?.length)) {
                mappedModels[key] = model
            }
        }
    } else mappedModels = models

    // re-assign models to mappedModels
    data.models = Object.assign({}, mappedModels ?? {}, data.variables)
    if (headerInfo) data.headerInfo = Object.assign({}, headerInfo)

    // set modal data and show modal
    const app = useApp()
    Object.assign(app.modal, { data, serverModels: models, callback })
    setTimeout(() => (app.modal.data.dialog = true), 150)
}
