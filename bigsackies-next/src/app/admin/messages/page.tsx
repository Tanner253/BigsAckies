"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/components/NotificationSystem";
import { 
  MessageSquare, 
  Reply, 
  Eye, 
  Clock, 
  CheckCircle, 
  User,
  Calendar,
  Mail,
  Building,
  Send,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

type Message = {
  id: number;
  user_id: number | null;
  user_email: string;
  message: string;
  status: string;
  response: string | null;
  responded_at: string | null;
  created_at: string;
  users: {
    name: string;
    email: string;
  } | null;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const fetchMessages = async (page = 1, status = "all") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(status !== "all" && { status })
      });

      const response = await fetch(`/api/admin/messages?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
        setTotalPages(data.pagination.totalPages);
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch messages"
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch messages"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMessage = async (messageId: number) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`);
      const message = await response.json();

      if (response.ok) {
        setSelectedMessage(message);
        setResponseText(message.response || "");
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, status: message.status === "Unread" ? "Read" : msg.status }
              : msg
          )
        );
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch message details"
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch message details"
      });
    }
  };

  const handleRespondToMessage = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: responseText.trim()
        })
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setSelectedMessage(updatedMessage);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === selectedMessage.id 
              ? { ...msg, status: "Replied", response: responseText.trim(), responded_at: new Date().toISOString() }
              : msg
          )
        );
        addNotification({
          type: "success",
          title: "Response Sent",
          message: "Your response has been saved successfully"
        });
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to send response"
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to send response"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!selectedMessage) {
        fetchMessages(currentPage, statusFilter);
    }
  }, [currentPage, statusFilter, selectedMessage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Unread":
        return "bg-red-100 text-red-800 border-red-200";
      case "Read":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Replied":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Unread":
        return <MessageSquare className="w-4 h-4" />;
      case "Read":
        return <Eye className="w-4 h-4" />;
      case "Replied":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const parseMessage = (message: string) => {
    const lines = message.split('\n');
    const messageIndex = lines.findIndex(line => line.includes('Message:'));
    if (messageIndex !== -1) {
      return lines.slice(messageIndex + 1).join('\n').trim();
    }
    return message;
  };

  const getMessagePreview = (message: string) => {
    const parsed = parseMessage(message);
    return parsed.length > 100 ? parsed.substring(0, 100) + "..." : parsed;
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parseMessage(message.message).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (selectedMessage) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setSelectedMessage(null)}
          className="mb-6 border-purple-500/50 text-stellar-white hover:bg-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Messages
        </Button>

        <div className="space-y-6">
            <Card className="bg-slate-800 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-stellar-white">
                  Message Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-slate-700 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-stellar-silver" />
                        <span className="font-medium text-stellar-white">From</span>
                      </div>
                      <p className="text-stellar-silver">{selectedMessage.users?.name || "Unknown"}</p>
                      <p className="text-stellar-silver text-sm">{selectedMessage.user_email}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-stellar-silver" />
                        <span className="font-medium text-stellar-white">Date</span>
                      </div>
                      <p className="text-stellar-silver">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                      <Badge className={`${getStatusColor(selectedMessage.status)} mt-2`}>
                        {selectedMessage.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-700 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-stellar-white">Original Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-600 p-4 rounded-lg">
                      <pre className="text-stellar-silver text-sm whitespace-pre-wrap font-sans">
                        {parseMessage(selectedMessage.message)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-lg text-stellar-white">Respond to Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                    className="min-h-[150px] bg-slate-700 border-purple-500/30 text-white placeholder-slate-400"
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={handleRespondToMessage}
                      disabled={!responseText.trim() || isSubmitting}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {selectedMessage.response ? 'Update Response' : 'Send Response'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stellar-white mb-2">Customer Messages</h1>
          <p className="text-sm sm:text-base text-stellar-silver">Manage and respond to customer inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-stellar-white border-nebula-violet">
            {filteredMessages.length} Messages
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-slate-800 border-purple-500/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 w-full">
              <Search className="w-4 h-4 text-stellar-silver" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-purple-500/50 text-white placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-stellar-silver" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-slate-700 border-purple-500/50 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-purple-500/50">
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="Unread">Unread</SelectItem>
                  <SelectItem value="Read">Read</SelectItem>
                  <SelectItem value="Replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="bg-slate-800 border-purple-500/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center p-8 text-stellar-silver">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => handleViewMessage(message.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                        <div className="flex items-center gap-2 truncate">
                          <User className="w-4 h-4 text-stellar-silver flex-shrink-0" />
                          <span className="font-medium text-stellar-white truncate">
                            {message.users?.name || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-4 h-4 text-stellar-silver flex-shrink-0" />
                          <span className="text-sm text-stellar-silver truncate">
                            {message.user_email}
                          </span>
                        </div>
                      </div>
                      <p className="text-stellar-silver text-sm mb-2 break-words">
                        {getMessagePreview(message.message)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-stellar-silver">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(message.created_at).toLocaleDateString()}</span>
                        </div>
                        {message.responded_at && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Replied {new Date(message.responded_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <Badge className={`${getStatusColor(message.status)} flex items-center gap-1`}>
                        {getStatusIcon(message.status)}
                        {message.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-purple-500/50 text-stellar-white hover:bg-purple-500/20 px-2 sm:px-4"
          >
            <ChevronLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <span className="text-stellar-silver text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="border-purple-500/50 text-stellar-white hover:bg-purple-500/20 px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
} 