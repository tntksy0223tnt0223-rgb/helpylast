
import React from 'react';

export type IconName =
  | 'hospital' | 'plus' | 'medical-kit' | 'trash' | 'no-smoking' | 'wine-glass'
  | 'calendar' | 'chevron-left' | 'chevron-right' | 'syringe' | 'sparkles'
  | 'paper-airplane' | 'microphone' | 'x-mark' | 'check' | 'dashboard'
  | 'users' | 'heart-pulse' | 'clipboard' | 'pill' | 'info' | 'pencil' | 'warning';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const getIconPath = (iconName: IconName) => {
    switch (iconName) {
      case 'hospital': return <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5h1.5a3.375 3.375 0 003.375-3.375V3.375c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v1.875a3.375 3.375 0 003.375 3.375h1.5c.621 0 1.125.504 1.125 1.125v1.5a3.375 3.375 0 00-3.375 3.375v1.875c0 .621-.504 1.125-1.125 1.125h-1.5a3.375 3.375 0 00-3.375 3.375h-1.5Z" />;
      case 'plus': return <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />;
      case 'medical-kit': return <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662a4.006 4.006 0 0 0 4.006 4.006h7.218a4.006 4.006 0 0 0 4.006-4.006ZM12 18.75h.008v.008H12v-.008Z" />;
      case 'trash': return <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.144-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.057-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />;
      case 'no-smoking': return <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />;
      case 'wine-glass': return <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15 4.5V3.75a2.25 2.25 0 0 0-4.5 0V4.5m4.5 0h-4.5M15 4.5l-1.5 7.5M9 4.5l1.5 7.5m-3 0h12" />;
      case 'calendar': return <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />;
      case 'chevron-left': return <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />;
      case 'chevron-right': return <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />;
      case 'syringe': return <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 5.25-1.06-.916a2.25 2.25 0 0 0-3.182 0l-1.06.916m0 0L9.75 3.75M15.75 5.25l-1.562 1.563a2.25 2.25 0 1 1-3.182-3.182l1.562-1.563M14.25 11.25 12 13.5l-1.5-1.5m3 0-.154-.154a2.25 2.25 0 0 1-3.182 0l-.154.154M4.5 12.75l6 6 9-13.5" />;
      case 'sparkles': return <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />;
      case 'paper-airplane': return <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />;
      case 'microphone': return <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-12 0v1.5m12 0v-1.5a6 6 0 0 0-12 0v1.5" />;
      case 'x-mark': return <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />;
      case 'check': return <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />;
      case 'dashboard': return <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5A2.25 2.25 0 0 0 0 5.25v11.25c0 1.24 1.01 2.25 2.25 2.25h11.25c1.24 0 2.25-1.01 2.25-2.25v-1.5M3.75 3h11.25A2.25 2.25 0 0 1 17.25 5.25v1.5M3.75 3h11.25m-11.25 0h11.25m0 0v11.25A2.25 2.25 0 0 1 15 16.5h-1.5m-1.5-1.5h-6v6h6v-6Z" />;
      case 'users': return <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.75-5.25c0-1.02-.375-2.006-.975-2.822A4.503 4.503 0 0 0 15.75 9c-1.036 0-2.028.326-2.857.904.12.35.21.713.26 1.086a4.5 4.5 0 0 1-5.81 2.822A9.066 9.066 0 0 0 6 18.72m12 0a9.043 9.043 0 0 1-12 0m12 0c0-2.485-2.015-4.5-4.5-4.5s-4.5 2.015-4.5 4.5m4.5-4.5v-2.25a2.25 2.25 0 0 0-2.25-2.25a2.25 2.25 0 0 0-2.25 2.25v2.25" />;
      case 'heart-pulse': return <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />;
      case 'clipboard': return <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />;
      case 'pill': return <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />;
      case 'info': return <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />;
      case 'pencil': return <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />;
      case 'warning': return <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />;
      default: return null;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      {getIconPath(name)}
    </svg>
  );
};

export default Icon;