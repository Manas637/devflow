import emailQueue from "../queues/email.queue.js";

class EmailQueueService {
  async addVerificationEmailJob({
    user,
    token,
  }) {
    return emailQueue.add(
      "verification-email",
      {
        type: "verification",
        to: user.email,
        name: user.name,
        token,
      }
    );
  }

  async addPasswordResetEmailJob({
    user,
    token,
  }) {
    return emailQueue.add(
      "password-reset-email",
      {
        type: "password-reset",
        to: user.email,
        name: user.name,
        token,
      }
    );
  }

  async addOrganizationInvitationEmailJob({
    email,
    name,
    organizationName,
    role,
    token,
  }) {
    return emailQueue.add(
      "organization-invitation-email",
      {
        type: "organization-invitation",
        to: email,
        name,
        organizationName,
        role,
        token,
      }
    );
  }
}

export default new EmailQueueService();