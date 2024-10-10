const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            console.log(`[XenoLog] Command '${interaction.commandName}' requested by ${interaction.user.tag}`);

            // Vérification des permissions
            if (command.ownerOnly && interaction.user.id !== process.env.BOT_OWNER_ID) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée au propriétaire du bot.', ephemeral: true });
            }

            if (command.devOnly && interaction.user.id !== process.env.BOT_DEV_ID) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée aux développeurs du bot.', ephemeral: true });
            }

            if (command.adminOnly && !interaction.member.permissions.has('ADMINISTRATOR')) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée aux administrateurs.', ephemeral: true });
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`[XenoError] Erreur lors de l'exécution de la commande '${interaction.commandName}' :`, error);
                const embed = new EmbedBuilder()
                    .setColor("DarkRed")
                    .setTitle('🛑 Erreur')
                    .setDescription('Une erreur est survenue lors de l\'exécution de cette commande.');
                interaction.reply({ embeds: [embed] });
            }
        } else if (interaction.isButton()) {
            // Handle button interactions
            if (interaction.customId === 'fill_form') {
                const modal = new ModalBuilder()
                    .setCustomId('form_modal')
                    .setTitle('Formulaire d\'inscription');

                const firstNameInput = new TextInputBuilder()
                    .setCustomId('first_name')
                    .setLabel('Prénom')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const lastNameInput = new TextInputBuilder()
                    .setCustomId('last_name')
                    .setLabel('Nom')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const groupInput = new TextInputBuilder()
                    .setCustomId('group')
                    .setLabel('Groupe (C1 ou C2)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const firstNameRow = new ActionRowBuilder().addComponents(firstNameInput);
                const lastNameRow = new ActionRowBuilder().addComponents(lastNameInput);
                const groupRow = new ActionRowBuilder().addComponents(groupInput);

                modal.addComponents(firstNameRow, lastNameRow, groupRow);

                await interaction.showModal(modal);
            }
            else if (interaction.customId === 'accept_member') {
                const message = interaction.message;
                const embed = message.embeds[0];
                const userId = embed.footer.text.split('ID : ')[1];

                const member = interaction.guild.members.cache.get(userId);

                const [firstName, lastName, group] = embed.description.split('\n').map(line => line.split('**')[2]);
                const newNickname = `${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}.`;


                if (member) {
                    const role = interaction.guild.roles.cache.find(role => role.name === 'Membre');
                    member.roles.add(role);
                    member.setNickname(newNickname);
                    interaction.reply({ content: 'Le membre a bien été accepté.', ephemeral: true });
                }
            }
            else if (interaction.customId === 'refuse_member') {
                const modal = new ModalBuilder()
                .setCustomId('refuse_reason_modal')
                .setTitle('Raison du refus');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('refuse_reason')
                    .setLabel('Raison du refus')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const actionRow = new ActionRowBuilder().addComponents(reasonInput);
                modal.addComponents(actionRow);

                await interaction.showModal(modal);
            }
        } else if (interaction.isModalSubmit()) {
            // Handle modal submissions
            if (interaction.customId === 'form_modal') {
                const firstName = interaction.fields.getTextInputValue('first_name');
                const lastName = interaction.fields.getTextInputValue('last_name');
                const group = interaction.fields.getTextInputValue('group');

                const verif_embed = new EmbedBuilder()
                    .setTitle('Nouveau Membre en attente')
                    .setDescription(`**Prénom :** ${firstName}\n**Nom :** ${lastName}\n**Groupe :** ${group}`)
                    .setColor('Blue')
                    .setFooter({ text: `ID : ${interaction.user.id}` });

                const acceptButton = new ButtonBuilder()
                    .setCustomId('accept_member')
                    .setLabel('Accepter')
                    .setStyle(ButtonStyle.Success);
                
                const refuseButton = new ButtonBuilder()
                    .setCustomId('refuse_member')
                    .setLabel('Refuser')
                    .setStyle(ButtonStyle.Danger);

                const actionRow = new ActionRowBuilder().addComponents(acceptButton, refuseButton);

                // Send the verification message and check for an answer to the buttons

                const channel = client.channels.cache.get("1291074777334677587");
                if (channel) {
                    channel.send({ embeds: [verif_embed], components: [actionRow] });
                }

                interaction.reply({ content: 'Votre demande a bien été envoyée.', ephemeral: true });

            }
            else if (interaction.customId === 'refuse_reason_modal') {
                const reason = interaction.fields.getTextInputValue('refuse_reason');
                const message = interaction.message;
                const embed = message.embeds[0];
                const userId = embed.footer.text.split('ID : ')[1];

                const member = interaction.guild.members.cache.get(userId);

                if (member) {
                    member.send(`Votre demande d'inscription a été refusée pour la raison suivante :\n${reason}`);
                    interaction.reply({ content: 'Le membre a bien été refusé et sera expulsé dans 10 secondes.', ephemeral: true });
                    setTimeout(() => {
                        member.kick(`Demande d\'inscription refusée par ${interaction.user.tag} : ${reason}`);
                    }, 10000);
                }
            }
        }
    }
};