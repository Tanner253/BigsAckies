
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/components/NotificationSystem";
import { MessageSquare, Send, Calendar, User, Shield } from "lucide-react";
import type { Variants } from "framer-motion";

type Message = {
  id: number;
  message: string;
  response: string | null;
  responded_at: string | null;
  created_at: string;
};

export default function AccountMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const fetchMessages = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/account/messages");
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load your messages."
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "An error occurred while fetching your messages."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [session]);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/account/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Message Sent",
          message: "We've received your message and will get back to you soon."
        });
        setNewMessage("");
        fetchMessages(); // Refresh messages list
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to send your message. Please try again."
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "An error occurred while sending your message."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <h1 className="text-3xl font-bold gradient-text">My Messages</h1>
        <p className="text-stellar-silver/70">
          View your conversation history with our team.
        </p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <Card className="card-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-nebula-cyan" />
              <span>Send a New Message</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-cosmic min-h-[120px]"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" className="btn-cosmic" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <h2 className="text-2xl font-bold gradient-text mb-4">Message History</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nebula-cyan"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-stellar-silver/70 text-center py-8">
            You have no messages yet. Send one above to get started!
          </p>
        ) : (
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {messages.map((msg) => (
              <motion.div key={msg.id} variants={itemVariants}>
                <Card className="card-cosmic overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* User's Message */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-nebula-blue to-nebula-cyan flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-stellar-white">You</p>
                            <span className="text-xs text-stellar-silver/70 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-stellar-silver whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      </div>

                      {/* Admin's Response */}
                      {msg.response && (
                        <div className="flex gap-4 pl-8">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-stellar-white">Admin Response</p>
                              {msg.responded_at &&
                                <span className="text-xs text-stellar-silver/70 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(msg.responded_at).toLocaleString()}
                                </span>
                              }
                            </div>
                            <div className="bg-slate-700/50 p-3 rounded-lg">
                              <p className="text-stellar-silver whitespace-pre-wrap">{msg.response}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 