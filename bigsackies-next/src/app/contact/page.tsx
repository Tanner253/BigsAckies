"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/components/NotificationSystem";
import { Mail, Phone, MapPin, Clock, Instagram, Youtube, Github, Send, User, Book, MessageSquare } from "lucide-react";

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(1, "Please select a subject."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormData = z.infer<typeof formSchema>;

async function submitContactForm(data: FormData) {
  "use server";
  // Here you would add logic to handle the form submission, 
  // like sending an email or saving to a database.
  // For now, we'll just log it to the console.
  console.log("New contact form submission:", data);
  // In a real app, you might want to revalidate a path or handle errors.
}

export default function ContactPage() {
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
      addNotification({
        type: "success",
        title: "Message Sent!",
        message: "Thanks for reaching out. We'll get back to you soon!",
      });
      reset();
    } catch (error) {
      addNotification({
        type: "error",
        title: "Submission Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-30" />
      <div className="nebula-particles" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-cosmic-shimmer">
            Get In Touch
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-2xl mx-auto">
            Have questions about our reptiles, care, or just want to say hello? Drop us a line!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2 card-cosmic p-8 rounded-2xl"
          >
            <h2 className="text-3xl font-bold mb-6 gradient-text">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-stellar-white flex items-center gap-2">
                    <User size={16} /> Name
                  </label>
                  <Input {...register("name")} placeholder="Your Name" className="input-cosmic" />
                  {errors.name && <p className="text-nebula-rose text-sm">{errors.name.message}</p>}
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-stellar-white flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <Input {...register("email")} placeholder="your.email@example.com" className="input-cosmic" />
                  {errors.email && <p className="text-nebula-rose text-sm">{errors.email.message}</p>}
                </div>
              </div>
              {/* Subject */}
              <div className="space-y-2">
                 <label className="text-stellar-white flex items-center gap-2">
                   <Book size={16} /> Subject
                 </label>
                 <Controller
                   name="subject"
                   control={control}
                   render={({ field }) => (
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <SelectTrigger className="input-cosmic">
                         <SelectValue placeholder="Select a subject" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Product Question">Product Question</SelectItem>
                         <SelectItem value="Order Inquiry">Order Inquiry</SelectItem>
                         <SelectItem value="Care Advice">Care Advice</SelectItem>
                         <SelectItem value="General Feedback">General Feedback</SelectItem>
                       </SelectContent>
                     </Select>
                   )}
                 />
                 {errors.subject && <p className="text-nebula-rose text-sm">{errors.subject.message}</p>}
              </div>
              {/* Message */}
              <div className="space-y-2">
                <label className="text-stellar-white flex items-center gap-2">
                  <MessageSquare size={16} /> Message
                </label>
                <Textarea {...register("message")} placeholder="Tell us what's on your mind..." rows={6} className="input-cosmic" />
                {errors.message && <p className="text-nebula-rose text-sm">{errors.message.message}</p>}
              </div>
              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full btn-cosmic text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="loading-cosmic" />
                ) : (
                  <>
                    <Send className="mr-2" size={18} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="card-cosmic p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail size={20} className="text-nebula-cyan" />
                  <a href="mailto:percivaltanner@gmail.com" className="text-stellar-silver hover:text-nebula-cyan transition">
                    percivaltanner@gmail.com
                  </a>
                </div>
                {/* Add phone or address if available */}
              </div>
            </div>
            <div className="card-cosmic p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Follow Us</h3>
              <div className="flex items-center space-x-4">
                <a href="https://www.instagram.com/BiggsAckies/" target="_blank" rel="noopener noreferrer" className="text-stellar-silver hover:text-nebula-hot-pink transition">
                  <Instagram size={24} />
                </a>
                <a href="https://www.youtube.com/@osknyo" target="_blank" rel="noopener noreferrer" className="text-stellar-silver hover:text-nebula-rose transition">
                  <Youtube size={24} />
                </a>
                <a href="https://github.com/Tanner253" target="_blank" rel="noopener noreferrer" className="text-stellar-silver hover:text-nebula-cyan transition">
                  <Github size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 