export function sendMessage(res, status, message)
{
    res.status(status).json({message: message, status: status});
}