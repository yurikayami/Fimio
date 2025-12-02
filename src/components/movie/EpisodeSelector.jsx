import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const EpisodeSelector = ({ episodes = [], onEpisodeSelect }) => {
  const [currentServer, setCurrentServer] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState(-1);

  if (!episodes || episodes.length === 0) {
    return null;
  }

  const handleServerChange = (index) => {
    setCurrentServer(index);
    setActiveEpisode(-1);
  };

  const handleEpisodeClick = (episodeIndex) => {
    setActiveEpisode(episodeIndex);
    const episode = episodes[currentServer].server_data[episodeIndex];
    if (onEpisodeSelect) {
      onEpisodeSelect(episode.link_embed, episode.name);
    }
  };

  return (
    <div className="bg-secondary/80 rounded-lg border border-slate-700 p-6">
      {/* Server Tabs */}
      {episodes.length > 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Chọn Server</h3>
          <div className="flex flex-wrap gap-2">
            {episodes.map((server, idx) => (
              <Button
                key={idx}
                onClick={() => handleServerChange(idx)}
                variant={currentServer === idx ? 'default' : 'outline'}
                className="min-w-[100px]"
              >
                {server.server_name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Episodes Grid */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 p-2">
          Chọn tập ({episodes[currentServer]?.server_data?.length || 0} tập)
        </h3>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {episodes[currentServer]?.server_data?.map((episode, idx) => (
              <Button
                key={idx}
                onClick={() => handleEpisodeClick(idx)}
                variant={activeEpisode === idx ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  "font-medium transition-all",
                  activeEpisode === idx && "ring-2 ring-accent ring-offset-2 ring-offset-background"
                )}
              >
                {episode.name.replace(/Tập\s*/i, '')}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
