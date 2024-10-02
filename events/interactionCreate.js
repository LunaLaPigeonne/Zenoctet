const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'fill_form') {
            // Afficher le modal
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
        } else if (interaction.isModalSubmit() && interaction.customId === 'form_modal') {
            // Gérer la soumission du modal
            const firstName = interaction.fields.getTextInputValue('first_name');
            const lastName = interaction.fields.getTextInputValue('last_name');
            const group = interaction.fields.getTextInputValue('group');

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Nouvelle Inscription')
                .addFields(
                    { name: 'Prénom', value: firstName, inline: true },
                    { name: 'Nom', value: lastName, inline: true },
                    { name: 'Groupe', value: group, inline: true }
                );

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_entry')
                .setLabel('Accepter')
                .setStyle(ButtonStyle.Success);

            const rejectButton = new ButtonBuilder()
                .setCustomId('reject_entry')
                .setLabel('Refuser')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);

            const channel = interaction.client.channels.cache.get('1291074777334677587');
            if (channel) {
                await channel.send({ embeds: [embed], components: [row] });
            }

            await interaction.reply({ content: 'Votre formulaire a été soumis avec succès.', ephemeral: true });
        } else if (interaction.isButton() && (interaction.customId === 'accept_entry' || interaction.customId === 'reject_entry')) {
            // Gérer les interactions avec les boutons d'acceptation et de refus
            const embed = interaction.message.embeds[0];
            const firstName = embed.fields.find(field => field.name === 'Prénom').value;
            const lastName = embed.fields.find(field => field.name === 'Nom').value;
            const group = embed.fields.find(field => field.name === 'Groupe').value;

            const userId = interaction.user.id;
            const guild = interaction.guild;
            const member = guild.members.cache.get(userId);
            const user = await interaction.client.users.fetch(userId);
            if (!user) {
                return interaction.reply({ content: 'Utilisateur non trouvé.', ephemeral: true });
            }

            if (interaction.customId === 'accept_entry') {
                const roleId = '1283104919968022661';
                await member.roles.add(roleId);
                await user.send(`Votre entrée a été acceptée. Votre rôle a été ajouté !`);

                const updatedEmbed = EmbedBuilder.from(embed)
                    .setColor('Green')
                    .setTitle('Inscription Acceptée');

                await interaction.update({ embeds: [updatedEmbed], content: 'Entrée acceptée et rôle ajouté.', components: [] });
            } else if (interaction.customId === 'reject_entry') {
                await user.send(`Votre entrée a été refusée, ${firstName} ${lastName} du groupe ${group}.`);

                const updatedEmbed = EmbedBuilder.from(embed)
                    .setColor('Red')
                    .setTitle('Inscription Refusée');

                await interaction.update({ embeds: [updatedEmbed], content: 'Entrée refusée.', components: [] });
            }
        }
    }
};