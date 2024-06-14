import { unlinkSync } from 'fs';
import { createAudioFileFromText } from 'src/elevenlabs/textToSpeechFile.ts';
import { Message, MessageMedia } from 'whatsapp-web.js';
import { middleware } from '../../middleware/middleware';
import COMMANDS from '../commands';
import { COMMANDS_COST } from '../commandsCost';

const audioMessage = async (msg: Message) => {
  let text;

  if (msg.hasQuotedMsg) {
    const quote = await msg.getQuotedMessage();
    text = quote?.body.replace('!audio', '').trim() || '';
  } else {
    text = msg.body.replace('!audio', '').trim();
  }

  const fileName = await createAudioFileFromText(text);

  const reply = MessageMedia.fromFilePath(fileName);

  await msg.reply(reply);

  unlinkSync(fileName);
};

export default middleware(audioMessage, {
  cost: COMMANDS_COST.AUDIO,
});
