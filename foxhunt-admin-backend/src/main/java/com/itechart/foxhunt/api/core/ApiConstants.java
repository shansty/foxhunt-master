package com.itechart.foxhunt.api.core;

public class ApiConstants {

    public static final String API_VERSION = "v1";
    public static final String API_PREFIX = "/api" + "/" + API_VERSION;
    public static final String ID = "/{id}";
    public static final String SYSTEM = "/system";

    public static final String USERS = API_PREFIX + "/users";
    public static final String LOGIN = API_PREFIX + "/login";
    public static final String LOCATIONS = API_PREFIX + "/locations";
    public static final String HEALTH = API_PREFIX + "/health";
    public static final String LOCATION_PACKAGES = API_PREFIX + "/location-packages";
    public static final String ALL_ORGANIZATION_PACKAGES = API_PREFIX + "/organization-packages";
    public static final String COMPETITIONS = API_PREFIX + "/competitions";
    public static final String COMPETITION_TEMPLATES = API_PREFIX + "/competition-templates";
    public static final String ACTIVE_COMPETITIONS = API_PREFIX + "/active-competitions";
    public static final String DISTANCE_TYPES = API_PREFIX + "/distance-types";
    public static final String REPLAY_COMPETITIONS = API_PREFIX + "/replay-competitions";
    public static final String SINGLE_PARTICIPANT_COMPETITIONS = API_PREFIX + "/single-participant-competitions";
    public static final String USER_FEEDBACKS = API_PREFIX + "/user-feedbacks";
    public static final String HELP_CONTENT = API_PREFIX + "/help-content";
    public static final String TOOLTIPS = API_PREFIX + "/tooltips";

    public static final String SIZE = "/size";
    public static final String ADMIN = "/admin";
    public static final String FAVORITE = "/favorite";
    public static final String TOGGLE_FAVORITE = ID + FAVORITE;
    public static final String LOGOUT = "/logout";
    public static final String CURRENT_USER = "/current-user";
    public static final String AUTHENTICATE = "/authentication";
    public static final String AUTHENTICATE_SYSTEM = AUTHENTICATE + SYSTEM;
    public static final String FORGOT_PASSWORD = "/forgot-password";
    public static final String RESET_PASSWORD = "/reset-password";
    public static final String RESET_PASSWORD_LINK = RESET_PASSWORD + "/{token}";
    public static final String CHANGE_ORGANIZATION = AUTHENTICATE + "/change-organization";
    public static final String PASSWORD = "/password";
    public static final String CHANGE_PASSWORD = "/change-password";
    public static final String COMPETITION_RESULTS = "/results";
    public static final String ORGANIZATION_ADMIN = "/organization-admin";
    public static final String AUTHENTICATE_GOOGLE = "/authentication/google";

    public static final String VERIFY = "/verify/{orgDomain}/invitation/{status}/{token}";

    public static final String COUNT_COMPETITION_STATE = ID + SIZE;
    public static final String ACCEPT_COMPETITION_INVITATION = ID + "/invitation/accept";
    public static final String DECLINE_COMPETITION_INVITATION = ID + "/invitation/decline";
    public static final String PERMANENT_DECLINE_INVITATION = ID + "/invitation/permanent-decline";
    public static final String COMPETITION_INVITATIONS = ID + "/invitations";
    public static final String PARTICIPANT_FINISH = ID + "/participant/finish";
    public static final String COMPETITION_PARTICIPANT = ID + "/participants";
    public static final String SUBSCRIPTION = "/subscription";
    public static final String SUBSCRIBE_COMPETITION = ID + SUBSCRIPTION;
    public static final String CANCELLATION = ID + "/cancellation";
    public static final String START = ID + "/start";
    public static final String FINISH = ID + "/finish";
    public static final String TRACK_DEVICE = ID + "/track";
    public static final String ACTIVE = "/active";
    public static final String ACTIVE_BY_ID = "/active" + ID;
    public static final String DEACTIVATE_USER = ID + "/deactivation";
    public static final String REACTIVATE_USER = ID + "/reactivation";
    public static final String INFO = "/info";

    public static final String REGISTRATION_INFO = "/registration-info";
    public static final String HELP_CONTENT_ARTICLE = "/article";
    public static final String HELP_CONTENT_TOPIC = "/topic";
    public static final String HELP_CONTENT_ARTICLE_CREATION_BY_TOPIC_ID = HELP_CONTENT_TOPIC + ID + HELP_CONTENT_ARTICLE;
    public static final String HELP_CONTENT_TOPIC_BY_ID = HELP_CONTENT_TOPIC + ID;
    public static final String HELP_CONTENT_ARTICLE_BY_ID = HELP_CONTENT_ARTICLE + ID;

    public static final String ORGANIZATIONS = API_PREFIX + "/organizations";
    public static final String CURRENT = "/current";
    public static final String ACTIVATION_BY_ID = ID + "/activation";
    public static final String DOMAIN = "/{domain}";
    public static final String ORGANIZATION_BY_DOMAIN = "/domain" + DOMAIN;
    public static final String ORGANIZATION_STATUS = ID + "/status";

    public static final String USER_INVITATIONS = API_PREFIX + "/user-invitations";
    public static final String DECLINE_REASON = ID + "/decline-reason";
    public static final String DECLINE = ID + "/decline";
    public static final String RESEND = ID + "/resend";

    public static final String ROLE_ORGANIZATION_ADMIN = "ROLE_ORGANIZATION_ADMIN";
    public static final String ROLE_PARTICIPANT = "ROLE_PARTICIPANT";
    public static final String ROLE_TRAINER = "ROLE_TRAINER";
    public static final String ROLE_SYSTEM_ADMIN = "ROLE_SYSTEM_ADMIN";
    public static final String ROLE_UNSUPPORTED = "ROLE_UNSUPPORTED";

    public static final String ORGANIZATION_FEATURES = API_PREFIX + "/feature-organization";

    public static final String BAD_INVITATION = "Bad invitation";
    public static final String ID_PATH_VARIABLE = "id";
    public static final String TIMESTAMP_WITHOUT_TIMEZONE = "yyyy-MM-dd'T'HH:mm:ss";

    public static final String SOURCE_PARTICIPANT = "Participant";
    public static final String SOURCE_TRAINER = "Trainer";
}
