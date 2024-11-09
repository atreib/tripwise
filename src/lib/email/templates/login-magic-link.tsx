import "server-only";

import { appConstants } from "@/app/constants";

function MagicLinkTemplate(props: { name: string; url: string }) {
  return (
    <div>
      <h1>Sign in on {appConstants.APP_NAME}</h1>
      <h2>Hey {props.name} 👋🏻</h2>
      <p>
        Click the link below to sign in to your account on{" "}
        <strong>{appConstants.APP_NAME}</strong>
      </p>
      <a href={props.url} target="_blank">
        Sign in
      </a>
      <p>You are one step closer to planning your next trip!</p>
      <p className="text-sm text-gray-500">
        If the link above doesn&apos;t work, you can copy and paste the
        following URL into your browser:
      </p>
      <p className="text-sm text-gray-500">{props.url}</p>
      <p className="text-xs text-gray-500 mt-4">
        If you didn&apos;t request this, please ignore this email. The link will
        expire in 5 minutes.
      </p>
    </div>
  );
}

export { MagicLinkTemplate };
