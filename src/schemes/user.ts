import * as yup from 'yup';

const addSchema = yup.object().shape({
    name: yup.string().required('required_field'),
    username: yup.string().required('required_field'),
    email: yup.string().email().required('required_field'),
    password: yup.string().required('required_field'),
    role_id: yup.number().required('required_field'),
    status: yup.boolean().required('required_field'),
});

const updateSchema = yup.object().shape({
    name: yup.string().required('required_field'),
    username: yup.string().required('required_field'),
    email: yup.string().email().required('required_field'),
    password: yup.string(),
    role_id: yup.number().required('required_field'),
    status: yup.boolean().required('required_field'),
});

export { addSchema, updateSchema }