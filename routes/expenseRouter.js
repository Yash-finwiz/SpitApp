var express = require('express');
var controller = require('../components/expense')

var router = express.Router();
const csvWriter = require('csv-writer').createObjectCsvStringifier;
const Expense = require('../model/schema');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//Add Expense router
router.post('/v1/add', controller.addExpense)

//Edit group router 
router.post('/v1/edit', controller.editExpense)

//Delte group router
router.delete('/v1/delete', controller.deleteExpense)

//View Individual expense router
router.post('/v1/view', controller.viewExpense)

//View group expense router
router.post('/v1/group', controller.viewGroupExpense)

//View user expense router 
router.post('/v1/user', controller.viewUserExpense)

//View user recent expense router
router.post('/v1/user/recent', controller.recentUserExpenses)

//Get group category expense router
router.post('/v1/group/categoryExp', controller.groupCategoryExpense)

//Get user category expense router
router.post('/v1/user/categoryExp', controller.userCategoryExpense)

//Get group monthly expense router 
router.post('/v1/group/monthlyExp', controller.groupMonthlyExpense)

//Get group daily expesnse router 
router.post('/v1/group/dailyExp', controller.groupDailyExpense)

//Get user monthly expense router 
router.post('/v1/user/monthlyExp', controller.userMonthlyExpense)

//Get user daily expense router 
router.post('/v1/user/dailyExp', controller.userDailyExpense)

router.get('/download-csv', async (req, res) => {
    try {
        const expenses = await Expense.find({
            groupId: req.query.groupId // Adjust if using authentication to filter by user/group
        });

        if (!expenses || expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found for the specified group.' });
        }

        const csvStringifier = csvWriter({
            header: [
                { id: '_id', title: 'ID' },
                { id: 'expenseName', title: 'Expense Name' },
                { id: 'expenseDescription', title: 'Description' },
                { id: 'expenseAmount', title: 'Amount' },
                { id: 'expenseOwner', title: 'Owner' },
                { id: 'expenseDate', title: 'Date' }
            ]
        });

        const records = expenses.map(expense => ({
            _id: expense._id,
            expenseName: expense.expenseName,
            expenseDescription: expense.expenseDescription,
            expenseAmount: expense.expenseAmount,
            expenseOwner: expense.expenseOwner,
            expenseDate: expense.expenseDate.toISOString()
        }));

        const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
        res.status(200).end(csvData);

    } catch (error) {
        logger.error(`URL : ${req.originalUrl} | status : 500 | message: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;