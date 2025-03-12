import client, { Channel } from "amqplib";


class RabbitMQConnection {
    connection!: client.ChannelModel;
    channel!: Channel;
    private connected!: Boolean;

    async connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;

        try {
            this.connection = await client.connect(
                process.env.RABBIT_URL as string
            );

            this.channel = await this.connection.createChannel();

        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    async sendToQueue(queue: string, message: any) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.assertQueue(queue, { durable: true });

            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
