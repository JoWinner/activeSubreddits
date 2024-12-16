import Image from "next/image";
import { GetFeaturedModal } from "./modals/get-featured-modal";
import Link from "next/link";

export const Footer = () => (
  <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="">
        <h4 className="text-lg font-semibold" > Redditors Online</h4>
        <Link href="/">
   <Image
  src="/images/logo.svg"
  alt="Logo"
  width={20}
  height={20}
  className="h-16 w-16"
/></Link>
          <p className="text-sm text-muted-foreground">
          Track active users across different subreddits in real-time for free and time your posts!

</p>
        </div>

        {/* <div className="space-y-4">
          <h4 className="text-lg font-semibold">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="https://cloud.umami.is/share/pwTG1tlfwJ22QAjl/redditors.online" 
              className="hover:text-primary">
                View Analytics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Changelog
              </a>
            </li>
          </ul>
        </div> */}

        {/* <div className="space-y-4">
          <h4 className="text-lg font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms-of-service">Terms of Service</Link>
            </li>
          </ul>
        </div> */}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Info</h4>
          <div className="flex text-base text-muted-foreground space-x-4">
            <GetFeaturedModal />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Redditors Online. All rights reserved.
      </div>
    </div>
  </div>
);
