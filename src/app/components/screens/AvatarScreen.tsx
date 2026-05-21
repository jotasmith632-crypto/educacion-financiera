import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { AvatarRenderer } from '../ui/AvatarRenderer';

interface Avatar {
  id: string;
  face: string;
  skin: string;
  hair: string;
  accessory: string;
}

interface AvatarScreenProps {
  avatar: Avatar;
  setAvatar: React.Dispatch<React.SetStateAction<Avatar>>;
  onSave: () => void;
}

export const AvatarScreen: React.FC<AvatarScreenProps> = ({ avatar, setAvatar, onSave }) => {
  const avatarOptions = {
    faces: ['😊', '😎', '🤓', '😄', '🤗', '😇'],
    skins: ['#FFD1A0', '#F1C27D', '#D4A574', '#A97C5D', '#8D5524', '#6B3410'],
    hairs: ['🦱', '👨', '👱', '🧑‍🦰', '🧑‍🦱', '💇'],
    accessories: ['🎓', '👑', '🎯', '⚡', '🌟', '🏆']
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Mi Avatar</h1>
              <p className="text-white/90 text-sm">Personaliza tu personaje</p>
            </div>
          </div>
          <Motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium border border-white/30"
          >
            Guardar
          </Motion.button>
        </div>
      </div>

      <div className="p-6 -mt-4 max-w-md mx-auto space-y-6">
        {/* Avatar Preview */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
          <div className="w-36 h-36 rounded-full mx-auto mb-4 flex items-center justify-center relative border-4 border-purple-50 shadow-inner bg-gradient-to-tr from-purple-50 to-pink-50 overflow-hidden">
            <AvatarRenderer avatar={avatar} size={120} />
          </div>
          <p className="text-gray-600 font-medium">Tu personaje único</p>
        </div>

        {/* Customization Options */}
        <div className="space-y-5">
          {/* Face */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">😊</span>
              Cara
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.faces.map((face) => (
                <Motion.button
                  key={face}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, face });
                  }}
                  className={`p-1 rounded-xl transition-all flex items-center justify-center ${
                    avatar.face === face
                      ? 'bg-purple-100 ring-2 ring-purple-400'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <AvatarRenderer avatar={{ ...avatar, face }} size={44} />
                </Motion.button>
              ))}
            </div>
          </div>

          {/* Skin Color */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">🎨</span>
              Color de piel
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.skins.map((skin) => (
                <Motion.button
                  key={skin}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, skin });
                  }}
                  className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center ${
                    avatar.skin === skin ? 'ring-2 ring-purple-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: skin }}
                >
                  <AvatarRenderer avatar={{ ...avatar, skin }} size={40} />
                </Motion.button>
              ))}
            </div>
          </div>

          {/* Hair */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">💇</span>
              Cabello
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.hairs.map((hair) => (
                <Motion.button
                  key={hair}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, hair });
                  }}
                  className={`p-1 rounded-xl transition-all flex items-center justify-center ${
                    avatar.hair === hair
                      ? 'bg-purple-100 ring-2 ring-purple-400'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <AvatarRenderer avatar={{ ...avatar, hair }} size={44} />
                </Motion.button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-xl">👑</span>
              Accesorios
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.accessories.map((accessory) => (
                <Motion.button
                  key={accessory}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setAvatar({ ...avatar, accessory });
                  }}
                  className={`p-1 rounded-xl transition-all flex items-center justify-center ${
                    avatar.accessory === accessory
                      ? 'bg-yellow-100 ring-2 ring-yellow-400'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <AvatarRenderer avatar={{ ...avatar, accessory }} size={44} />
                </Motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
