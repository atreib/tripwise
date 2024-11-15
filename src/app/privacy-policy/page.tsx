import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const policyContent = [
  {
    title: "Information We Collect",
    content: [
      "We collect and use the following types of personal information:",
      "OAuth Information: We use OAuth to collect your name and email address when you sign in to our service. We only access and use the information necessary to provide our services.",
      "Trip Planning Information: We generate trip planning details based on your inputs. We do not collect or store sensitive travel-related information beyond what is necessary to provide this service.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use your personal information for the following purposes:",
      "Account Creation and Management: Your name and email are used to create and manage your user account.",
      "Service Provision: To generate personalized trip planning information and ensure optimal service delivery.",
      "Communication: We may send emails related to service updates, important announcements, or feedback requests. You can opt out of receiving these communications.",
    ],
  },
  {
    title: "Data Sharing and Disclosure",
    content: [
      "We do not sell, trade, or otherwise transfer your personal information to outside parties. However, we may share your information under the following circumstances:",
      "With Your Consent: If you explicitly consent to share your data with third parties.",
      "Legal Requirements: When required by law, court order, or government regulations.",
      "Service Providers: Trusted third-party service providers who assist us in operating our website, provided they agree to keep your information confidential.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information. However, no system is entirely secure, and we cannot guarantee the security of your data.",
    ],
  },
  {
    title: "Your Rights and Choices",
    content: [
      "You have the right to:",
      "Access and Update Information: Review and update your personal information at any time.",
      "Delete Your Account: Request the deletion of your account and all associated personal data.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated date. We encourage you to review this policy regularly.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Last Updated: 15 November 2024
            </p>
            <p className="mt-4">
              This Privacy Policy describes how we collect, use, and protect
              your personal information when you use Tripwise (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;). Your privacy is important to
              us, and we are committed to handling your personal information
              responsibly.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {policyContent.map((section, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at{" "}
              <a
                href="mailto:tripwise@andretreib.com"
                className="text-primary hover:underline"
              >
                tripwise@andretreib.com
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
