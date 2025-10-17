import type { Testimonial } from '../types';

const TESTIMONIALS_KEY = 'nutriai_testimonials';

const getTestimonials = (): Testimonial[] => {
    const testimonialsJson = localStorage.getItem(TESTIMONIALS_KEY);
    return testimonialsJson ? JSON.parse(testimonialsJson) : [];
};

const saveTestimonials = (testimonials: Testimonial[]) => {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
};

export const testimonialService = {
    getTestimonials,
    addTestimonial(testimonialData: { userId: number; username: string; quote: string; rating: number }): Testimonial {
        const allTestimonials = getTestimonials();
        // Prevent duplicate reviews from the same user
        const existingReview = allTestimonials.find(t => t.userId === testimonialData.userId);
        if (existingReview) {
            throw new Error("You have already submitted a review.");
        }

        const newTestimonial: Testimonial = {
            id: Date.now(),
            avatar: `https://i.pravatar.cc/150?u=${testimonialData.userId}`, // Unique avatar per user
            ...testimonialData,
        };
        saveTestimonials([...allTestimonials, newTestimonial]);
        return newTestimonial;
    }
};
