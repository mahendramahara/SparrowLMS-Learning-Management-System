const SystemLog = require('../modules/admin/systemLog.model');

const logSystemEvent = async ({
  actor = null,
  actorName = 'System',
  actorEmail = '',
  action,
  category = 'SYSTEM',
  status = 'SUCCESS',
  req = null,
  details = {},
}) => {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || req?.headers?.['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req?.headers?.['user-agent'] || 'API Client';

    let resolvedActor = actor;
    let resolvedName = actorName;
    let resolvedEmail = actorEmail;

    if (req?.user) {
      resolvedActor = req.user._id || req.user.id || actor;
      resolvedName = req.user.name || actorName;
      resolvedEmail = req.user.email || actorEmail;
    }

    await SystemLog.create({
      actor: resolvedActor && typeof resolvedActor === 'object' && resolvedActor._id ? resolvedActor._id : (typeof resolvedActor === 'string' && !resolvedActor.startsWith('demo_') ? resolvedActor : null),
      actorName: resolvedName,
      actorEmail: resolvedEmail,
      action,
      category,
      status,
      ipAddress,
      userAgent,
      details,
    });
  } catch (err) {
    void err;
  }
};

module.exports = { logSystemEvent };
