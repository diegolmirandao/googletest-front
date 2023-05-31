import * as yup from 'yup';

const addSchema = yup.object().shape({
    name: yup.string().required('required_field'),
    identification_document: yup.string().required('required_field'),
    email: yup.string().nullable(),
    address: yup.string().nullable(),
});

const updateSchema = yup.object().shape({
    name: yup.string().required('required_field'),
    identification_document: yup.string().required('required_field'),
    email: yup.string().nullable(),
    address: yup.string().nullable(),
});

export { addSchema, updateSchema };