import * as yup from 'yup';

const addSchema = yup.object().shape({
    customer_category_id: yup.number().required('required_field'),
    acquisition_channel_id: yup.number().required('required_field'),
    name: yup.string().required('required_field'),
    identification_document: yup.string().required('required_field'),
    email: yup.string().nullable(),
    birthday: yup.string().nullable(),
    address: yup.string().nullable(),
});

const updateSchema = yup.object().shape({
    customer_category_id: yup.number().required('required_field'),
    acquisition_channel_id: yup.number().required('required_field'),
    name: yup.string().required('required_field'),
    identification_document: yup.string().required('required_field'),
    email: yup.string().nullable(),
    birthday: yup.string().nullable(),
    address: yup.string().nullable(),
});

export { addSchema, updateSchema };