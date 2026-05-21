import React from 'react';

interface Avatar {
  id: string;
  face: string;
  skin: string;
  hair: string;
  accessory: string;
}

interface AvatarRendererProps {
  avatar: Avatar;
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  size = 'md',
  className = ''
}) => {
  // Determine width and height based on size prop
  let pixelSize = 128;
  if (size === 'sm') pixelSize = 56;
  else if (size === 'md') pixelSize = 128;
  else if (size === 'lg') pixelSize = 180;
  else if (typeof size === 'number') pixelSize = size;

  // Safe Fallbacks for Emojis to Keys mapping
  // This ensures that if the database has the emoji, it renders the beautiful SVG version.
  const getFaceKey = (face: string) => {
    if (face === '😊') return 'happy';
    if (face === '😎') return 'cool';
    if (face === '🤓') return 'nerd';
    if (face === '😄') return 'excited';
    if (face === '🤗') return 'friendly';
    if (face === '😇') return 'angel';
    return face; // Fallback if already key
  };

  const getHairKey = (hair: string) => {
    if (hair === '🦱') return 'curly';
    if (hair === '👨') return 'short';
    if (hair === '👱') return 'blonde';
    if (hair === '🧑‍🦰') return 'ginger';
    if (hair === '🧑‍🦱') return 'dreads';
    if (hair === '💇') return 'bob';
    return hair;
  };

  const getAccessoryKey = (accessory: string) => {
    if (accessory === '🎓') return 'grad';
    if (accessory === '👑') return 'crown';
    if (accessory === '🎯') return 'target';
    if (accessory === '⚡') return 'lightning';
    if (accessory === '🌟') return 'stars';
    if (accessory === '🏆') return 'trophy';
    return accessory;
  };

  const faceKey = getFaceKey(avatar?.face || '😊');
  const hairKey = getHairKey(avatar?.hair || '🦱');
  const accessoryKey = getAccessoryKey(avatar?.accessory || '🎓');
  const skinColor = avatar?.skin || '#FFD1A0';

  // Helper to generate a slightly darker tone of the skin for neck/ears shadowing
  const getDarkerSkin = (hex: string) => {
    // Basic conversion to darken
    if (hex === '#FFD1A0') return '#E6B88A';
    if (hex === '#F1C27D') return '#D9A964';
    if (hex === '#D4A574') return '#BC8D5C';
    if (hex === '#A97C5D') return '#916445';
    if (hex === '#8D5524') return '#753D0C';
    if (hex === '#6B3410') return '#531C00';
    return '#E0A96D'; // Default dark skin shadow
  };

  const darkerSkin = getDarkerSkin(skinColor);

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Gradients */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.1} />
        </radialGradient>
        
        {/* Hair Gradients */}
        <linearGradient id="hairCurlyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D1E18" />
          <stop offset="100%" stopColor="#120A07" />
        </linearGradient>
        
        <linearGradient id="hairShortGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="hairBlondeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        <linearGradient id="hairGingerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>

        <linearGradient id="hairBobGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

        {/* Crown Gold Gradient */}
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Cyber Monocle Cyan Gradient */}
        <linearGradient id="cyanGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>

      {/* 1. Base Container Shadow & Inner Glow */}
      <circle cx="60" cy="60" r="56" fill="url(#bgGlow)" />
      
      {/* 2. Character Torso / Shoulders */}
      <path
        d="M25,110 C25,95 40,88 60,88 C80,88 95,95 95,110 Z"
        fill="#E2E8F0"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      {/* Shirt details (collar V-neck) */}
      <path d="M48,88 Q60,98 72,88" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60,88 V94" stroke="#94A3B8" strokeWidth="2" />

      {/* 3. Neck */}
      <rect x="49" y="74" width="22" height="20" rx="10" fill={darkerSkin} />

      {/* 4. Ears */}
      <circle cx="21" cy="65" r="7.5" fill={skinColor} stroke={darkerSkin} strokeWidth="1" />
      <circle cx="99" cy="65" r="7.5" fill={skinColor} stroke={darkerSkin} strokeWidth="1" />
      {/* Ear details */}
      <path d="M20,63 Q23,65 20,67" stroke={darkerSkin} strokeWidth="1" fill="none" />
      <path d="M100,63 Q97,65 100,67" stroke={darkerSkin} strokeWidth="1" fill="none" />

      {/* 5. Head Base Shape */}
      <rect
        x="24"
        y="27"
        width="72"
        height="56"
        rx="28"
        fill={skinColor}
        stroke={darkerSkin}
        strokeWidth="1.5"
      />

      {/* 6. Hair Behind Accessories */}
      {/* Render base hair background shapes if hair bob or long */}
      {hairKey === 'blonde' && (
        <path
          d="M21,55 Q12,70 18,90 Q22,95 28,88 L25,50 Z M99,55 Q108,70 102,90 Q98,95 92,88 L95,50 Z"
          fill="url(#hairBlondeGrad)"
        />
      )}
      {hairKey === 'bob' && (
        <path
          d="M22,50 Q16,65 21,78 L29,74 Z M98,50 Q104,65 99,78 L91,74 Z"
          fill="url(#hairBobGrad)"
        />
      )}

      {/* 7. Eyes, Eyebrows & Mouth (Face Expressions) */}
      {/* Happy Face */}
      {faceKey === 'happy' && (
        <>
          {/* Eyebrows */}
          <path d="M40,48 Q47,44 52,48" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M68,48 Q73,44 80,48" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Curved Happy Eyes */}
          <path d="M38,57 Q46,51 52,57" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M68,57 Q74,51 82,57" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Cheeks Blush */}
          <circle cx="34" cy="64" r="5" fill="#F43F5E" opacity="0.3" />
          <circle cx="86" cy="64" r="5" fill="#F43F5E" opacity="0.3" />
          {/* Smile */}
          <path d="M48,67 Q60,78 72,67" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Cool Face (Sunglasses) */}
      {faceKey === 'cool' && (
        <>
          {/* Smile */}
          <path d="M52,70 Q62,75 70,68" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Sunglasses */}
          <path
            d="M30,50 C28,50 28,59 34,59 C44,59 45,54 48,54 C51,54 52,59 62,59 C68,59 72,59 78,59 C81,59 81,50 78,50 C68,50 67,50 60,50 C53,50 52,50 42,50 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          {/* Lens Reflections */}
          <path d="M34,52 L44,56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          <path d="M64,52 L74,56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        </>
      )}

      {/* Nerd Face */}
      {faceKey === 'nerd' && (
        <>
          {/* Glasses Frames */}
          <circle cx="44" cy="55" r="13" stroke="#1E293B" strokeWidth="3" fill="none" />
          <circle cx="76" cy="55" r="13" stroke="#1E293B" strokeWidth="3" fill="none" />
          <line x1="57" y1="55" x2="63" y2="55" stroke="#1E293B" strokeWidth="3.5" />
          {/* Eyes */}
          <circle cx="44" cy="55" r="3.5" fill="#111827" />
          <circle cx="76" cy="55" r="3.5" fill="#111827" />
          <circle cx="42" cy="53" r="1" fill="#FFFFFF" />
          <circle cx="74" cy="53" r="1" fill="#FFFFFF" />
          {/* Smile with two cute teeth */}
          <path d="M48,70 Q60,79 72,70 Z" fill="#881337" />
          <rect x="56" y="70" width="3.5" height="4" fill="#FFFFFF" rx="0.5" />
          <rect x="60.5" y="70" width="3.5" height="4" fill="#FFFFFF" rx="0.5" />
        </>
      )}

      {/* Excited Face */}
      {faceKey === 'excited' && (
        <>
          {/* Eyebrows */}
          <path d="M38,44 Q46,42 50,47" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M70,44 Q74,42 82,47" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Joyful Eyes */}
          <path d="M37,56 Q45,50 51,56" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M69,56 Q75,50 83,56" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Blush */}
          <circle cx="34" cy="62" r="5" fill="#F43F5E" opacity="0.3" />
          <circle cx="86" cy="62" r="5" fill="#F43F5E" opacity="0.3" />
          {/* Open Mouth laughing */}
          <path d="M44,66 C44,66 48,82 60,82 C72,82 76,66 76,66 Z" fill="#881337" />
          {/* Tongue */}
          <path d="M52,77 C52,77 56,82 60,82 C64,82 68,77 68,77 Z" fill="#FB7185" />
          {/* Teeth */}
          <path d="M46,67 H74" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* Friendly Face */}
      {faceKey === 'friendly' && (
        <>
          {/* Soft eyebrows */}
          <path d="M39,47 C43,45 48,46 51,49" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M69,49 C72,46 77,45 81,47" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Round friendly eyes */}
          <circle cx="45" cy="56" r="5" fill="#111827" />
          <circle cx="75" cy="56" r="5" fill="#111827" />
          {/* Eye Sparkles */}
          <circle cx="43.5" cy="54.5" r="1.5" fill="#FFFFFF" />
          <circle cx="46.5" cy="57.5" r="0.8" fill="#FFFFFF" />
          <circle cx="73.5" cy="54.5" r="1.5" fill="#FFFFFF" />
          <circle cx="76.5" cy="57.5" r="0.8" fill="#FFFFFF" />
          {/* Warm Smile */}
          <path d="M47,66 Q60,77 73,66" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Cute sparkle vectors */}
          <path d="M28,62 L30,64 L28,66 L26,64 Z" fill="#FBBF24" />
          <path d="M92,62 L94,64 L92,66 L90,64 Z" fill="#FBBF24" />
        </>
      )}

      {/* Angel Face */}
      {faceKey === 'angel' && (
        <>
          {/* Closed peaceful eyes */}
          <path d="M38,58 Q45,64 52,58" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M68,58 Q75,64 82,58" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Serene smile */}
          <path d="M52,68 Q60,73 68,68" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Soft Blush */}
          <circle cx="34" cy="64" r="4" fill="#F43F5E" opacity="0.25" />
          <circle cx="86" cy="64" r="4" fill="#F43F5E" opacity="0.25" />
          {/* Floating Gold Halo above head */}
          <ellipse cx="60" cy="18" rx="22" ry="5" stroke="#F59E0B" strokeWidth="3.5" fill="none" opacity="0.9" />
          <ellipse cx="60" cy="18" rx="16" ry="3" stroke="#FDE047" strokeWidth="1.5" fill="none" opacity="0.7" />
        </>
      )}

      {/* 8. Hairstyles (Foreground part) */}
      {/* Curly Afro Hair */}
      {hairKey === 'curly' && (
        <path
          d="M26,38 C21,38 18,31 22,25 C20,18 27,10 34,13 C38,7 48,6 54,11 C58,5 68,5 72,10 C78,6 88,8 89,15 C95,12 101,17 99,24 C104,30 101,38 95,38 C99,44 95,51 89,51 L31,51 C25,51 21,44 26,38 Z"
          fill="url(#hairCurlyGrad)"
        />
      )}

      {/* Short Spiky Hair */}
      {hairKey === 'short' && (
        <path
          d="M23,38 C21,36 21,30 25,27 L33,26 L35,17 C36,14 41,13 43,17 L47,24 L56,15 C58,12 62,12 64,15 L73,24 L77,17 C79,14 84,14 85,17 L87,26 L95,27 C99,30 99,36 97,38 L94,44 L26,44 Z"
          fill="url(#hairShortGrad)"
        />
      )}

      {/* Blonde Styled Hair */}
      {hairKey === 'blonde' && (
        <path
          d="M24,34 Q22,18 42,12 Q60,10 78,12 Q98,18 96,34 C94,22 84,18 76,18 C60,18 60,22 44,18 C36,18 26,22 24,34 Z"
          fill="url(#hairBlondeGrad)"
        />
      )}

      {/* Ginger Casual Hair */}
      {hairKey === 'ginger' && (
        <path
          d="M23,38 C21,24 38,11 60,11 C82,11 99,24 97,38 C92,30 84,23 74,23 C62,23 58,28 46,24 C36,20 28,30 23,38 Z"
          fill="url(#hairGingerGrad)"
        />
      )}

      {/* Dreads/Tight Short Hair */}
      {hairKey === 'dreads' && (
        <g fill="#2D1E18">
          <circle cx="30" cy="24" r="5" />
          <circle cx="38" cy="18" r="5" />
          <circle cx="48" cy="15" r="5" />
          <circle cx="60" cy="14" r="5" />
          <circle cx="72" cy="15" r="5" />
          <circle cx="82" cy="18" r="5" />
          <circle cx="90" cy="24" r="5" />
          <circle cx="34" cy="30" r="5" />
          <circle cx="44" cy="24" r="5" />
          <circle cx="56" cy="21" r="5" />
          <circle cx="68" cy="21" r="5" />
          <circle cx="80" cy="24" r="5" />
          <circle cx="86" cy="30" r="5" />
          <path d="M25,36 H95 V42 H25 Z" />
        </g>
      )}

      {/* Bob Purple Cut */}
      {hairKey === 'bob' && (
        <path
          d="M23,36 C23,16 40,11 60,11 C80,11 97,16 97,36 C97,44 94,40 92,36 C86,22 78,20 60,20 C42,20 34,22 28,36 C26,40 23,44 23,36 Z"
          fill="url(#hairBobGrad)"
        />
      )}

      {/* 9. Accessories (On top of head and hair) */}
      {/* Graduation mortarboard cap */}
      {accessoryKey === 'grad' && (
        <g>
          {/* Cap Base */}
          <path d="M40,24 V30 Q60,38 80,30 V24" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          {/* Diamond Plate */}
          <path d="M60,6 L98,18 L60,30 L22,18 Z" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M60,6 L60,30" stroke="#1E293B" strokeWidth="1" opacity="0.3" />
          {/* Button on top */}
          <circle cx="60" cy="18" r="2.5" fill="#F59E0B" />
          {/* Golden Tassel */}
          <path d="M60,18 L34,24 V33" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
          {/* Tassel Brush */}
          <path d="M31,33 L37,33 L34,39 Z" fill="#D97706" />
        </g>
      )}

      {/* Royal Gold Crown */}
      {accessoryKey === 'crown' && (
        <g>
          {/* Crown Base and peaks */}
          <path
            d="M32,32 L40,14 L60,25 L80,14 L88,32 Z"
            fill="url(#goldGrad)"
            stroke="#B45309"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Crown band detailing */}
          <rect x="36" y="27" width="48" height="3" fill="#D97706" rx="1" />
          {/* Gems */}
          <circle cx="40" cy="14" r="2.5" fill="#EF4444" />
          <circle cx="60" cy="25" r="2.5" fill="#3B82F6" />
          <circle cx="80" cy="14" r="2.5" fill="#EF4444" />
          <circle cx="48" cy="28.5" r="1.2" fill="#3B82F6" />
          <circle cx="60" cy="28.5" r="1.2" fill="#10B981" />
          <circle cx="72" cy="28.5" r="1.2" fill="#3B82F6" />
        </g>
      )}

      {/* Cyber target monocle */}
      {accessoryKey === 'target' && (
        <g>
          {/* Outer Ring */}
          <circle cx="76" cy="55" r="17" stroke="url(#cyanGlow)" strokeWidth="2.2" fill="none" strokeDasharray="3 2" />
          {/* Inner ring */}
          <circle cx="76" cy="55" r="12" stroke="url(#cyanGlow)" strokeWidth="1" fill="none" opacity="0.7" />
          {/* Tech targeting points */}
          <line x1="76" y1="34" x2="76" y2="38" stroke="#22D3EE" strokeWidth="2" />
          <line x1="76" y1="72" x2="76" y2="76" stroke="#22D3EE" strokeWidth="2" />
          <line x1="55" y1="55" x2="59" y2="55" stroke="#22D3EE" strokeWidth="2" />
          <line x1="93" y1="55" x2="97" y2="55" stroke="#22D3EE" strokeWidth="2" />
          {/* Glow dot */}
          <circle cx="84" cy="47" r="2" fill="#22D3EE" />
          {/* Connector to ear */}
          <path d="M93,55 Q99,57 99,63" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
        </g>
      )}

      {/* Golden Lightning Bolt */}
      {accessoryKey === 'lightning' && (
        <g>
          {/* Hanging lightning bolt on right ear */}
          <path
            d="M99,65 Q104,67 104,70 L108,70 L102,80 L104,75 L100,75 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Cool lightning decal on cheek */}
          <path
            d="M32,60 L38,64 L34,65 L37,70 L30,64 L33,63 Z"
            fill="#F59E0B"
            opacity="0.8"
          />
        </g>
      )}

      {/* Magic Stars */}
      {accessoryKey === 'stars' && (
        <g fill="#FBBF24">
          {/* Star 1 */}
          <path d="M22,16 L24,20 L28,22 L24,24 L22,28 L20,24 L16,22 L20,20 Z" />
          {/* Star 2 */}
          <path d="M96,20 L97.5,23 L100.5,24.5 L97.5,26 L96,29 L94.5,26 L91.5,24.5 L94.5,23 Z" />
          {/* Star 3 (small) */}
          <path d="M84,10 L85,12 L87,13 L85,14 L84,16 L83,14 L81,13 L83,12 Z" />
        </g>
      )}

      {/* Gamer Gold Headphones */}
      {accessoryKey === 'trophy' && (
        <g>
          {/* Golden metallic headband arch */}
          <path
            d="M20,64 A42,42 0 0,1 100,64"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M20,64 A42,42 0 0,1 100,64"
            fill="none"
            stroke="#B45309"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Left Cup */}
          <rect x="13" y="52" width="10" height="22" rx="5" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
          <rect x="18" y="56" width="3" height="14" rx="1.5" fill="#78350F" />
          {/* Right Cup */}
          <rect x="97" y="52" width="10" height="22" rx="5" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
          <rect x="99" y="56" width="3" height="14" rx="1.5" fill="#78350F" />
          
          {/* Futuristic Micro */}
          <path d="M18,68 Q18,78 30,78" fill="none" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="30" cy="78" r="2" fill="#D97706" />
        </g>
      )}
    </svg>
  );
};
