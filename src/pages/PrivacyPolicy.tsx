import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Eye, Database, Lock, Trash2 } from "lucide-react";

export default function PrivacyPolicy() {
  const { t, isRTL } = useTranslation();

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect your email address, display name, avatar, and in-app activity data (XP, points, game results) to provide and improve our services.",
    },
    {
      icon: Database,
      title: "How We Use Your Data",
      content: "Your data is used to manage your account, track progress, enable chat features, and improve user experience. We never sell your personal information.",
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We use industry-standard encryption and secure cloud infrastructure to protect your data. Access is restricted to authorized systems only.",
    },
    {
      icon: Shield,
      title: "Third-Party Services",
      content: "We use trusted third-party services for authentication, data storage, and analytics. These services comply with applicable data protection regulations.",
    },
    {
      icon: Trash2,
      title: "Data Deletion",
      content: "You can request deletion of your account and all associated data at any time by contacting support. Data will be permanently removed within 30 days.",
    },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title="Privacy Policy" />
      <div className="px-4 space-y-4 pt-2">
        <p className="text-sm text-muted-foreground text-center">
          Your privacy matters to us. Here's how we handle your data.
        </p>
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="bg-card/80 border-border">
              <CardContent className="p-4">
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <h3 className="text-sm font-bold text-foreground mb-1">{section.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <p className="text-[10px] text-muted-foreground text-center pt-2 italic">
          Last updated: March 2026
        </p>
      </div>
    </div>
  );
}