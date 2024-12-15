import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export function GetFeaturedModal() {
  return (
    <Dialog>
      <DialogTrigger className="text-base hover:text-primary">
       Get Featured
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">How to Get Featured</DialogTitle>
        </DialogHeader>
        <div className="h-[60vh] pr-4 overflow-y-auto">
          <div className="space-y-6 text-sm">
            <div className="flex flex-col">
              <p>Last Updated: October 30, 2024</p>
            </div>

            <section>
              <h2 className="text-lg font-semibold mb-2">1. About the Feature Program</h2>
              <p>
                As a valued Tabinet license holder, you have the chance to feature your product or service on Active Redditors’ website. This offers premium visibility to a highly targeted audience.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. How to Apply</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You can purchase a Tabinet license from our official 
                  <Link href="https://tabinetbrowser.com" passHref target="_blank" className="hover:underline text-blue-500">
                    website</Link>
                  </li>
                <li>Email your featuring materials to <strong>hello@tabinetbrowser.com</strong>, including:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Product/service image</li>
                    <li>Title of your product/service</li>
                    <li>Short description (up to 150 words)</li>
                    <li>Tagline</li>
                    <li>Link to your website or service page</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. Important Notes</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Feature spots are limited and offered on a first-come, first-served basis.</li>
                <li>Early buyers may be eligible for extended 45-day visibility, while others receive 30 days.</li>
                <li>The feature program may close at any time without prior notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Support</h2>
              <p>
                If you have questions or need help with your feature application, contact us at: <strong>hello@tabinetbrowser.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
