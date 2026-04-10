import React from 'react';
import * as Remotion from 'remotion';
import * as Lucide from 'lucide-react';

/**
 * The Master Shell acts as the bridge.
 * It provides all necessary imports as a local scope for the AI snippets.
 */

export const provideModularContext = (snippet: string) => {
  // We wrap the snippet in a function that provides hooks as arguments or in scope.
  // This avoids Claude having to write 'import' statements.
  
  return `
    const { 
      AbsoluteFill, 
      useCurrentFrame, 
      useVideoConfig, 
      interpolate, 
      spring, 
      Series,
      Sequence 
    } = Remotion;
    const Icons = Lucide;

    return (\${snippet});
  `;
};

export const MODULAR_ENGINE_SHELL = `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Series } from 'remotion';
import * as Icons from 'lucide-react';

/* {{SCENE_COMPONENTS}} */

export const Main = ({ sequenceMap, globalParams }) => {
  return (
    <Series>
       {sequenceMap.map((item, i) => (
         <Series.Sequence key={i} durationInFrames={item.duration}>
            <SceneRenderer id={item.id} params={{...globalParams, ...item.params}} />
         </Series.Sequence>
       ))}
    </Series>
  );
}
`;
