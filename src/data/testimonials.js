// No fabricated reviews here: only real customer testimonials belong in this list (or in the
// `reviews` Firestore collection, which Home.jsx prefers once it has entries).
export const testimonials = [];

export const getFeaturedTestimonials = () => {
  return testimonials.filter(t => t.featured);
};
