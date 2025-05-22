UPDATE fh_admin.help_content_topic
SET contents='{"editorText": [{"type":"paragraph","children":[{"text":"The application allows user to create a game map around him with control points (foxes) located in it, which must be found. First of all, this is a game for parks, residential areas and courtyards. The player don’t know the location of the control points. Each \"fox\" has a unique \"frequency\" (similar to the frequency of radio stations), which can be setup using the application, but it is also unknown. When user finds the frequency, he hears the signals sent from the fox, with which he can determine the position of the fox. General rule: the closer to the fox - the louder the sound, the more precisely the phone is directed towards the fox - the louder the sound. Very similar to a \"hot-cold\" game."}]},{"type":"paragraph","children":[{"text":"The goal of the game is to find the location of all foxes in a specified period of time."}]}]}'
WHERE title='About Foxhunt' AND index=1;

UPDATE fh_admin.help_content_article
SET contents='{"editorText": [{"type":"paragraph","children":[{"text":"The application provides the ability to play in two modes - individual and multiplayer. For an individual game use the \"Try Now\" button, for a multiplayer game - connect to one of the planned competitions in your location on the \"Upcoming Competitions\" tab"}]}]}'
WHERE title='Game modes' 
  AND index=1 
  AND help_content_topic_id=(SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules');

UPDATE fh_admin.help_content_article
SET contents='{"editorText": [{"type":"paragraph","children":[{"text":"The best place to start the game is the park. Try to choose a place with a minimum number of areas which are not available for you, such as fenced area, buildings and roads. Depending on the complexity of the competition, you may need from 100 to 1000 meters of free space."}]}]}'
WHERE title='Locations' 
  AND index=2 
  AND help_content_topic_id=(SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules');

UPDATE fh_admin.help_content_article
SET contents='{"editorText": [{"type":"paragraph","children":[{"text":"The fox is a checkpoint required to visit within the location. The game can have up to 5 foxes. Each of them has its own call sign, which is a Morse code for the fox."}]},{"type":"paragraph","children":[{"text":"1 - MOE, 2 - MOИ, 3 - MOС, 4 - MOX, 5 - MO5."}]},{"type":"paragraph","children":[{"text":"The number of fox also correlates with the number of short beeps at the end of the fox''s call sign. The signal is in a narrow frequency range, the range is unique to each fox and varies from competition to competition. Outside this range, user hears only noise."}]}]}'
WHERE title='Foxes' 
  AND index=3 
  AND help_content_topic_id=(SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules');

UPDATE fh_admin.help_content_article
SET contents='{"editorText": [{"type":"paragraph","children":[{"text":"Each fox send its signal for a strictly fixed time - from tens of seconds to several minutes, the value is set individual for each competition. The first signal is transmitted by the first fox, the next - by the second, and so on. At every moment strictly one fox sounds; the player can''t skip the signal back and forth. When all foxes have sent a signal, the cycle may start over again, or there will be a period of silence, which is equal in time to one signal from one fox."}]}]}'
WHERE title='Transfer Cycles'
  AND index=4 
  AND help_content_topic_id=(SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules');

UPDATE fh_admin.help_content_article
SET contents='{"editorText": [{"type":"paragraph","children":[{"text":"To find a fox, the user must go to it at a configurable distance from 10 to 20 meters. The user can find a fox at any time, even if fox isn''t active now or another of the foxes is active"}]}]}'
WHERE title='Conditions for finding a fox' 
  AND index=5 
  AND help_content_topic_id=(SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules');

UPDATE fh_admin.help_content_article
SET contents='{"editorText": [{"type":"paragraph","children":[{"text":"The game ends only when one of the following conditions is completed:"}]},{"type":"paragraph","children":[{"text":"a) The user has clicked “end participation”"}]},{"type":"paragraph","children":[{"text":"b) All foxes are found"}]},{"type":"paragraph","children":[{"text":"c) Time has ended"}]},{"type":"paragraph","children":[{"text":"d) In a multiplayer game, if the creator ends the game"}]}]}'
WHERE title='Game completion condition' 
  AND index=6 
  AND help_content_topic_id=(SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules');