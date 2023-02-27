<template>
    <h6 v-if="!!data.header && index === 0" v-bind="data.attrs" class="header">{{ data.header }}</h6>
    <v-tooltip :disabled="disableTooltip()" bottom>
        <template #activator="{ props }">
            <div v-bind="props">
                <!-- COMBO BOX WITH CREATE NOT LISTED ON THE OPTIONS -->
                <v-combobox
                    v-if="data.type?.toLowerCase() === 'combobox'"
                    v-show="toggleState('show', true)"
                    v-model="model[index]"
                    v-bind="data.attrs"
                    :search-input="search"
                    clearable
                    :auto-select-first="!data.acceptUserInput"
                    :label="
                        data.attrs?.label
                            ? data.attrs.label + (disabledByParent.value ? disabledByParent.message : '')
                            : ''
                    "
                    :color="companyInfo.theme.color"
                    :filter="inputFilter"
                    :item-value="data.attrs['item-text'] ? data.attrs['item-value'] || 'id' : 'value'"
                    :items="itemList"
                    :return-object="!!data.attrs['item-text'] && !returnValues"
                    :rules="rules()"
                    :disabled="toggleState('disabled', !!data.attrs?.disabled)"
                    :outlined="data.attrs.outlined !== false"
                    :loading="queryLoading"
                    autocomplete="new-password"
                    @update:search-input="(val) => (search = val)"
                    @keyup="$emit('search', search)"
                    @keydown=";/^[A-Za-z]+$/.test(String.fromCharCode($event.keyCode)) && $emit('search')"
                    @input="emitter"
                >
                    <template #no-data>
                        <v-list-item>
                            <v-list-item-action>
                                <v-list-item-title v-if="search && data.acceptUserInput && !queryLoading">
                                    Create
                                    <v-chip color="green lighten-3" label small>
                                        {{ search }}
                                    </v-chip>
                                    . Press
                                    <kbd>TAB</kbd>
                                    to continue.
                                </v-list-item-title>
                                <v-list-item-title
                                    v-else-if="
                                        data.queryOnDemand &&
                                        ((search && queryLoading) || (!search && !queryLoading))
                                    "
                                >
                                    <v-chip color="green lighten-3" label small>
                                        {{ search ? 'Searching...' : 'Start typing to search' }}
                                    </v-chip>
                                </v-list-item-title>
                                <v-list-item-title v-else>
                                    <v-chip color="red lighten-3" label small>No available data found</v-chip>
                                </v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-combobox>

                <!-- SELECT -->
                <v-select
                    v-if="data.type?.toLowerCase() === 'select'"
                    v-show="toggleState('show', true)"
                    v-model="model[index]"
                    v-bind="data.attrs"
                    :label="
                        data.attrs?.label
                            ? data.attrs.label + (disabledByParent.value ? disabledByParent.message : '')
                            : ''
                    "
                    :color="companyInfo.theme.color"
                    :items="itemList"
                    :return-object="!!data.attrs['item-text'] && !returnValues"
                    :rules="rules()"
                    :disabled="toggleState('disabled', !!data.attrs?.disabled)"
                    clearable
                    :outlined="data.attrs.outlined !== false"
                    @input="emitter"
                />

                <!-- TEXT FIELD -->
                <v-text-field
                    v-else-if="data.type?.toLowerCase() === 'textfield'"
                    v-show="toggleState('show', true)"
                    v-model="model[index]"
                    v-bind="data.attrs"
                    :label="
                        data.attrs?.label
                            ? data.attrs.label + (disabledByParent.value ? disabledByParent.message : '')
                            : ''
                    "
                    :color="companyInfo.theme.color"
                    :rules="rules()"
                    :loading="loading()"
                    :disabled="toggleState('disabled', !!data.attrs?.disabled)"
                    clearable
                    :outlined="data.attrs.outlined !== false"
                    @input="emitter"
                />

                <!-- CHECKBOX -->
                <v-checkbox
                    v-if="data.type?.toLowerCase() === 'checkbox'"
                    v-show="toggleState('show', true)"
                    v-model="model[index]"
                    v-bind="data.attrs"
                    :label="
                        data.attrs?.label
                            ? data.attrs.label + (disabledByParent.value ? disabledByParent.message : '')
                            : ''
                    "
                    :color="companyInfo.theme.color"
                    :rules="rules()"
                    :disabled="toggleState('disabled', !!data.attrs?.disabled)"
                    @change="emitter"
                />

                <!-- SWITCH -->
                <v-switch
                    v-if="data.type?.toLowerCase() === 'switch'"
                    v-show="toggleState('show', true)"
                    v-model="model[index]"
                    v-bind="data.attrs"
                    :label="
                        data.attrs?.label
                            ? data.attrs.label + (disabledByParent.value ? disabledByParent.message : '')
                            : ''
                    "
                    :color="companyInfo.theme.color"
                    :rules="rules()"
                    :disabled="toggleState('disabled', !!data.attrs?.disabled)"
                    @change="emitter"
                />

                <v-slider
                    v-if="data.type?.toLowerCase() === 'slider'"
                    v-model="model[index]"
                    v-bind="data.attrs"
                />

                <v-btn
                    v-if="data.type?.toLowerCase() === 'button'"
                    v-show="toggleState('show', true)"
                    v-bind="data.attrs"
                    :label="
                        data.attrs?.label
                            ? data.attrs.label + (disabledByParent.value ? disabledByParent.message : '')
                            : ''
                    "
                    :color="companyInfo.theme.color"
                    :disabled="toggleState('disabled', !!data.attrs?.disabled)"
                    :outlined="data.attrs.outlined !== false"
                    @click="$emit(data.event ? data.event : 'callback')"
                >
                    {{ data.text }}
                </v-btn>

                <v-radio-group
                    v-if="data.type?.toLowerCase() === 'radio'"
                    v-show="toggleState('show', true)"
                    v-model="model[index]"
                    v-bind="data.attrs"
                    :mandatory="data.required"
                    :disabled="toggleState('disabled', !!data.attrs?.disabled)"
                    @change="emitter"
                >
                    <v-radio
                        v-for="(item, i) in data.items || data.attrs.items"
                        :key="i"
                        :label="item.text"
                        :value="item.value"
                        :color="companyInfo.theme.color"
                    />
                </v-radio-group>

                <template v-if="data.type?.toLowerCase() === 'menu'">
                    <TableNestedMenu
                        v-for="menu in data.menus"
                        :key="menu.text"
                        :text="menu.text"
                        :items="menu.items"
                        :loading="menu.loading"
                        :disabled="menu.disabled"
                        @click="emitMenuCallback(menu, $event)"
                    />
                </template>
            </div>
        </template>

        <div v-if="tooltipLayout()">
            {{ getTooltipValue() }}
        </div>

        <TableSimple v-else-if="tooltipLayout('table')" :data="getTooltipValue()" />
    </v-tooltip>
</template>

<script>
export default {
    name: 'TableInput',
    inheritAttrs: false,
    props: {
        /**
         * Prop to define Input parameters
         *
         * @type {object} data
         * @example
            data: {
                type: 'comboBox',
                filter: false, // Disable result filtering while typing
                show: true, // Toggle v-show
                hidden: false, // Toggle v-show
                header: 'Example Header', // Display header before input

                // Used if you want to use a data set inside the items array
                items : [
                    {
                        name: "Test1", // Will be grouped Test1
                        innerData: [{name:'t1', value:'v1'},...] // Data to be used
                    },
                    {
                        name: "Test2", // Will be grouped Test2
                        innerData: [...] // Data to be used
                    },
                ],
                expanded: 'innerData',
                attrs: {
                    // Refer to vuetify documentation for more details
                    label: 'Branch',
                    'item-text': 'name',
                },
                required: true, // Require user to use the input
                emitter: (data) => {}, // Callback for input emit event

                // Used for parent and child relationship:

                // Set parent as String. This will look for the parent model
                // with this name and will check if the child id
                // is related to "[parentName]_id" key value
                parent: 'parentName',

                // Set parent as Object.
                parent: {
                    name: 'parentName',

                    // Name of the array of ids to be compared
                    // with parent id's existence
                    ids: 'ids'
                },

                // Add group of fields with same group name (String/Object)
                addMore: 'groupName',
                addMore: {
                    name: 'groupName',
                    onAdd: (data) => {}, // Callback upon add
                    onRemove: (data) => {}, // Callback upon remove

                    // Toggle this button (Boolean/Function)
                    disabled: true,
                    disabled: () => true,
                },

                // Set loading state (Boolean/Function)
                loading: false,
                loading: (index) => false,

                // Set input tooltip (String/Function/Object)
                tooltip: 'This is my tooltip',
                tooltip: () => 'This is my tooltip',
                tooltip: {
                    data: 'This is my tooltip', // Mixed
                    layout: 'table', // Component layout. Set empty if none

                    // Toggle (Boolean/Function)
                    disabled: false,
                    disabled: () => false
                }

            },

         */
        data: {
            type: Object,
            required: true,
        },
        /**
         * Item List
         * @type {Object}
         */
        items: {
            type: Array,
            default: null,
        },
        /**
         * Prop value status
         * @type {object}
         * @example
            {
                value: Boolean,
                message: ' << Branch is a prerequisite >>'
            }
         */
        disabledByParent: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Prop value status
         * @type {boolean}
         */
        returnValues: {
            type: Boolean,
            default: false,
        },
        /**
         * Automatically declared if v-model was used
         * @type undefined
         */
        value: {
            type: undefined,
            default: undefined,
        },
        /**
         * Used to track previous values
         * Primarily used for parent/child filtering
         * For example:
         * When a rack filter is dependent on a branch filter
         *
         * @type {object}
         */
        index: {
            type: Number,
            default: 0,
        },
        parentIndex: {
            type: Number,
            default: 0,
        },
        queryLoading: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['search', 'input'],
    data: () => ({
        companyInfo: useUser().companyInfo,
        search: '',
    }),
    computed: {
        model() {
            let value = this.value ?? this.data?.value ?? []
            if (isFunction(value)) value = value()
            return this.data?.attrs?.multiple ? [value.length ? value : undefined] : [].concat(value)
        },
        getData() {
            return {
                model: this.model,
                data: this.data,
                index: this.index,
                parentIndex: this.parentIndex,
            }
        },
        itemList() {
            return this.items || this.data.items || this.data.attrs?.items || []
        },
    },
    methods: {
        rules() {
            const rules = this.data?.attrs?.rules
            const errorMessage = isString(this.data.required)
                ? this.data.required
                : (this.data.attrs?.label ?? 'Input') + ' is required'

            return this.data.required
                ? [
                      (v) => {
                          return this.data.attrs.multiple && Array.isArray(v)
                              ? !!v.length || errorMessage
                              : !!v || errorMessage
                      },
                  ]
                : isFunction(rules)
                ? rules(this.getData)
                : rules
        },
        emitter() {
            /**
             * Event emitted to update v-model
             * @event input
             */
            this.$emit(
                'input',
                this.data.addMore || this.data.returnArray ? this.model : this.model[this.index],
                this.data.model,
            )

            const emitter = this.data?.emitter
            if (isFunction(emitter)) {
                emitter(this.getData)
            }
        },
        inputFilter(item, queryText, itemText) {
            // eslint-disable-next-line no-prototype-builtins
            return !this.data.hasOwnProperty('filter') || this.data.filter
                ? itemText.toLowerCase().includes(queryText.toLowerCase())
                : true
        },
        loading() {
            let loading = this.data?.loading ?? false
            if (isFunction(loading)) {
                loading = loading(this.index) ?? false
            }

            return loading
        },
        disableTooltip() {
            let disabled = this.data?.tooltip ?? true

            if (isString(disabled) || isFunction(disabled)) disabled = false

            if (isObject(disabled)) {
                disabled = disabled?.disabled ?? false

                if (isFunction(disabled)) {
                    disabled = disabled(this.getData) ?? true
                }
            }

            return disabled || !this.data?.tooltip
        },
        tooltipLayout(layout = '') {
            return this.data?.tooltip && layout === (this.data?.tooltip?.layout ?? '')
        },
        getTooltipValue() {
            let value = this.data?.tooltip ?? ''

            if (isFunction(value)) value = value(this.getData)

            if (isObject(value)) {
                value = value?.data

                if (isFunction(value)) {
                    value = value(this.getData)
                }
            }

            return value
        },
        emitMenuCallback(menu, { item: menuItem, index }) {
            this.$emit(this.data.event ?? 'callback', {
                action: menu,
                menuItem,
                index,
            })
        },
        toggleState(stateName, defaultState) {
            const state = this.data?.[stateName] ?? defaultState
            const parentRequired = stateName === 'disabled' && this.disabledByParent.value

            return parentRequired || (isFunction(state) ? state(this.getData) : state)
        },
    },
}
</script>
