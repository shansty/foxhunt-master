const acceptTitle = 'Accept';
const inviteTitle = 'Invite';
const declineTitle = 'Decline';
const permanentDeclineTitle = 'Decline Permanently';

export const dropdownItem = {
  getAcceptDeclineItems: (accept, decline, permanentDecline) => [
    { id: 352, title: acceptTitle, action: accept },
    { id: 353, title: declineTitle, action: decline },
    { id: 354, title: permanentDeclineTitle, action: permanentDecline },
  ],
  getDeclineItems: (decline, permanentDecline) => [
    { id: 355, title: declineTitle, action: decline },
    { id: 356, title: permanentDeclineTitle, action: permanentDecline },
  ],
  getInviteDeclineItems: (invite, permanentDecline) => [
    { id: 357, title: inviteTitle, action: invite },
    { id: 358, title: permanentDeclineTitle, action: permanentDecline },
  ],
};
