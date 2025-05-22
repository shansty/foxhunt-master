INSERT INTO fh_admin.help_content_topic(title, description, is_system, index)
VALUES ('About Foxhunt', 'The application allows user to create a game map around him with control points (foxes) located in it, which must be found. First of all, this is a game for parks, residential areas and courtyards. The player don’t know the location of the control points. Each "fox" has a unique "frequency" (similar to the frequency of radio stations), which can be setup using the application, but it is also unknown. When user finds the frequency, he hears the signals sent from the fox, with which he can determine the position of the fox. General rule: the closer to the fox - the louder the sound, the more precisely the phone is directed towards the fox - the louder the sound. Very similar to a "hot-cold" game.
The goal of the game is to find the location of all foxes in a specified period of time.', true, 1);

INSERT INTO fh_admin.help_content_topic(title, is_system, index)
VALUES ('Rules', true, 2),
       ('FAQ', true, 3);


INSERT INTO fh_admin.help_content_article(title, description, index, help_content_topic_id)
VALUES ('Game modes',
        'The application provides the ability to play in two modes - individual and multiplayer. For an individual game use the "Try Now" button, for a multiplayer game - connect to one of the planned competitions in your location on the "Upcoming Competitions" tab',
        1,
        (SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules')),
       ('Locations',
        'The best place to start the game is the park. Try to choose a place with a minimum number of areas which are not available for you, such as fenced area, buildings and roads. Depending on the complexity of the competition, you may need from 100 to 1000 meters of free space.',
        2,
        (SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules')),
       ('Foxes', 'The fox is a checkpoint required to visit within the location. The game can have up to 5 foxes. Each of them has its own call sign, which is a Morse code for the fox.
1 - MOE, 2 - MOИ, 3 - MOС, 4 - MOX, 5 - MO5.
The number of fox also correlates with the number of short beeps at the end of the fox''s call sign. The signal is in a narrow frequency range, the range is unique to each fox and varies from competition to competition. Outside this range, user hears only noise.',
        3,
        (SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules')),
       ('Transfer Cycles',
        'Each fox send its signal for a strictly fixed time - from tens of seconds to several minutes, the value is set individual for each competition. The first signal is transmitted by the first fox, the next - by the second, and so on. At every moment strictly one fox sounds; the player can''t skip the signal back and forth. When all foxes have sent a signal, the cycle may start over again, or there will be a period of silence, which is equal in time to one signal from one fox.',
        4,
        (SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules')),
       ('Conditions for finding a fox',
        'To find a fox, the user must go to it at a configurable distance from 10 to 20 meters. The user can find a fox at any time, even if fox isn''t active now or another of the foxes is active',
        5,
        (SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules')),
       ('Game completion condition', 'The game ends only when one of the following conditions is completed:

    a) The user has clicked “end participation”

    b) All foxes are found

    c) Time has ended

    d) In a multiplayer game, if the creator ends the game',
        6,
        (SELECT help_content_topic_id from fh_admin.help_content_topic WHERE help_content_topic.title = 'Rules'));