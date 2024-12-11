import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  
  export function PrivacyModal() {
    return (
      <Dialog>
        <DialogTrigger className="text-base hover:text-primary">
          Privacy Policy
        </DialogTrigger>
        <DialogContent className="max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] pr-4 overflow-y-auto">
            <div className="space-y-6 text-sm">
              <div className="flex flex-col">
                <p>Last Updated: October 30, 2024</p>
                <p>Effective Date: October 30, 2024</p>
              </div>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
                <p>
                  Tabinet (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. 
                  This privacy policy explains how we handle your data when you use our desktop application.
                </p>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">2. Data Collection and Storage</h2>
                <h3 className="font-medium mt-2">2.1 Local Storage</h3>
                <p>We store the following data locally on your device:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Browser history</li>
                  <li>License key information</li>
                  <li>Task management data</li>
                  <li>Custom titles and user-agents</li>
                  <li>User preferences and settings</li>
                </ul>
                
                <h3 className="font-medium mt-2">2.2 Incognito Mode Data</h3>
                <p>
                  Data from incognito tabs is temporarily stored only while the tab is open and is 
                  permanently deleted immediately upon closing the tab.
                </p>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">3. Third-Party Services</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Payment Processing:</strong> We use Lemon Squeezy for license key verification 
                    and payment processing. Please refer to Lemon Squeezy&apos;s privacy policy for details about 
                    their data handling practices.
                  </li>
                  <li>
                    <strong>Automatic Updates:</strong> Our application checks GitHub servers for updates. 
                    This process only transmits basic version information and does not include any personal data.
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">4. Future Updates</h2>
                <p>
                  We may implement analytics tools in the future to improve our service. If implemented, 
                  this privacy policy will be updated, and users will be notified of any changes in data 
                  collection practices by updating the &quot;Last Updated&quot; date at the top of this policy. 
                </p>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">5. Data Protection Rights</h2>
                <p>Under data protection laws, you have rights including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The right to access your personal data</li>
                  <li>The right to delete your personal data</li>
                  <li>The right to restrict processing</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing</li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">6. International Data Transfers</h2>
                <p>
                  While our application stores data locally, any interaction with Lemon Squeezy or GitHub 
                  may involve data transfers to servers in different jurisdictions. These transfers comply 
                  with applicable data protection laws including GDPR and CCPA.
                </p>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">7. Changes to Privacy Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes 
                  by updating the &quot;Last Updated&quot; date at the top of this policy.
                </p>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">8. Contact Information</h2>
                <p>
                  For any questions about this privacy policy or our privacy practices, please contact us 
                  at: hello@tabinetbrowser.com
                </p>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  