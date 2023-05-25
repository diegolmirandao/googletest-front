import * as yup from 'yup';

const addSchema = yup.object().shape({
    name: yup.string().required('required_field'),
    status: yup.boolean().required('required_field'),
    type_id: yup.number().required('required_field'),
    measurement_unit_id: yup.number().required('required_field'),
    category_id: yup.number().required('required_field'),
    subcategory_id: yup.number().required('required_field'),
    brand_id: yup.number().required('required_field'),
    taxed: yup.boolean().required('required_field'),
    tax: yup.number().required('required_field'),
    percentage_taxed: yup.number().required('required_field'),
    comments: yup.string().nullable(),
});

const updateSchema = yup.object().shape({
    name: yup.string().required('required_field'),
    status: yup.boolean().required('required_field'),
    type_id: yup.number().required('required_field'),
    measurement_unit_id: yup.number().required('required_field'),
    category_id: yup.number().required('required_field'),
    subcategory_id: yup.number().required('required_field'),
    brand_id: yup.number().required('required_field'),
    taxed: yup.boolean().required('required_field'),
    tax: yup.number().required('required_field'),
    percentage_taxed: yup.number().required('required_field'),
    comments: yup.string().nullable(),
});

export { addSchema, updateSchema };