import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form } from '../ui/form';

const PollForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const submitForm = async (data) => {
        setLoading(true);
        await onSubmit(data);
        setLoading(false);
    };

    return (
        <Form onSubmit={handleSubmit(submitForm)}>
            <div>
                <label htmlFor="title">Poll Title</label>
                <input
                    id="title"
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <span>{errors.title.message}</span>}
            </div>
            <div>
                <label htmlFor="description">Poll Description</label>
                <textarea
                    id="description"
                    {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <span>{errors.description.message}</span>}
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Poll'}
            </Button>
        </Form>
    );
};

export default PollForm;